import { ImapFlow } from "imapflow";
import { emailConfigured, founderEmail } from "./mail.mjs";

const ACCOUNT_ENV = {
  aztodev: { user: "GMAIL_USER", pass: "GMAIL_APP_PASS" },
  amzion: { user: "GMAIL_USER_AMZION", pass: "GMAIL_APP_PASS_AMZION" },
  zion: { user: "GMAIL_USER_ZION", pass: "GMAIL_APP_PASS_ZION" },
};

export function gmailReadConfigured() {
  return emailConfigured() || gmailAccountsConfigured().length > 0;
}

export function gmailAccountsConfigured() {
  return Object.entries(ACCOUNT_ENV)
    .filter(([, keys]) => {
      const u = (process.env[keys.user] || "").trim();
      const p = (process.env[keys.pass] || "").trim();
      return Boolean(u && p);
    })
    .map(([id]) => id);
}

function credsFor(account) {
  const key = String(account || "aztodev").trim().toLowerCase();
  const aliases = {
    aztodev: "aztodev",
    default: "aztodev",
    work: "aztodev",
    amzion: "amzion",
    amzion24: "amzion",
    zion: "zion",
    zion054: "zion",
    personal: "zion",
  };
  const id = aliases[key] || key;
  const keys = ACCOUNT_ENV[id];
  if (!keys) return { ok: false, error: `unknown_account:${id}` };
  const user = (process.env[keys.user] || "").trim();
  const pass = (process.env[keys.pass] || "").trim().replace(/\s+/g, "");
  if (!user || !pass) return { ok: false, error: `no_creds:${id}` };
  return { ok: true, id, user, pass };
}

async function withInbox(account, fn) {
  const creds = credsFor(account);
  if (!creds.ok) return creds;
  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: { user: creds.user, pass: creds.pass },
    logger: false,
  });
  try {
    await client.connect();
    const lock = await client.getMailboxLock("INBOX", { readOnly: true });
    try {
      return await fn(client, creds);
    } finally {
      lock.release();
    }
  } catch (err) {
    return {
      ok: false,
      error: String(err?.message || err).slice(0, 240),
      hint: "Enable IMAP in Gmail settings if login fails",
      account: creds.id,
    };
  } finally {
    try {
      await client.logout();
    } catch {
      /* ignore */
    }
  }
}

function envelopeRow(msg) {
  return {
    uid: msg.uid,
    from: msg.envelope?.from?.[0]?.address || "",
    fromName: msg.envelope?.from?.[0]?.name || "",
    subject: String(msg.envelope?.subject || "").slice(0, 180),
    date: msg.envelope?.date || null,
  };
}

/**
 * Peek recent inbox subjects. Does not send, delete, or mark all as read.
 */
export async function peekGmailInbox({ account = "aztodev", limit = 8 } = {}) {
  return withInbox(account, async (client, creds) => {
    const exists = client.mailbox.exists || 0;
    const take = Math.min(Number(limit) || 8, 20);
    const start = Math.max(1, exists - take + 1);
    const rows = [];
    if (exists > 0) {
      for await (const msg of client.fetch(`${start}:*`, {
        envelope: true,
        flags: true,
        uid: true,
      })) {
        rows.push(envelopeRow(msg));
      }
    }
    return {
      ok: true,
      mailbox: "INBOX",
      account: creds.id,
      user: creds.user,
      founder: founderEmail(),
      total: exists,
      recent: rows.slice(-take),
    };
  });
}

/**
 * Gmail search (read-only). `query` is Gmail search syntax when possible.
 */
export async function searchGmail({
  account = "aztodev",
  query = "",
  limit = 12,
} = {}) {
  const q = String(query || "").trim();
  if (!q) return { ok: false, error: "empty_query" };
  return withInbox(account, async (client, creds) => {
    let uids = [];
    try {
      uids = await client.search({ gmailRaw: q }, { uid: true });
    } catch {
      uids = await client.search({ or: [{ subject: q }, { body: q }] }, { uid: true });
    }
    const take = Math.min(Number(limit) || 12, 25);
    const slice = (uids || []).slice(-take);
    const rows = [];
    if (slice.length) {
      for await (const msg of client.fetch(slice, { envelope: true, uid: true }, { uid: true })) {
        rows.push(envelopeRow(msg));
      }
    }
    return {
      ok: true,
      account: creds.id,
      user: creds.user,
      query: q,
      totalHits: (uids || []).length,
      recent: rows,
    };
  });
}

export async function searchAllGmail({ query, limit = 8 } = {}) {
  const accounts = gmailAccountsConfigured();
  if (!accounts.length) return { ok: false, error: "no_gmail_creds", results: [] };
  const results = [];
  for (const account of accounts) {
    results.push(await searchGmail({ account, query, limit }));
  }
  return { ok: true, query, results };
}
