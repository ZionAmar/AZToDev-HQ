import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ImapFlow } from "imapflow";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const env = Object.fromEntries(
  fs
    .readFileSync(path.join(ROOT, ".env"), "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.trim().startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

function decodeQuotedPrintable(str) {
  return str
    .replace(/=\r?\n/g, "")
    .replace(/=([A-Fa-f0-9]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function stripHtml(html) {
  return decodeQuotedPrintable(html)
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}

function extractPdfParts(raw) {
  const pdfs = [];
  const parts = raw.split(/--[^\r\n]+/);
  for (const part of parts) {
    if (!/application\/pdf/i.test(part) && !/\.pdf/i.test(part)) continue;
    const fn = part.match(/filename=\"?([^\"\r\n;]+)/i)?.[1];
    const enc = /Content-Transfer-Encoding:\s*base64/i.test(part) ? "base64" : "raw";
    const body = part.split(/\r?\n\r?\n/).slice(1).join("\n").trim();
    if (!body) continue;
    try {
      const buf =
        enc === "base64"
          ? Buffer.from(body.replace(/\s+/g, ""), "base64")
          : Buffer.from(body, "binary");
      if (buf.length > 500 && buf.slice(0, 4).toString() === "%PDF") {
        pdfs.push({ filename: fn || "carmel-invoice.pdf", content: buf });
      }
    } catch {
      /* skip */
    }
  }
  return pdfs;
}

const user = env.GMAIL_USER_ZION;
const pass = (env.GMAIL_APP_PASS_ZION || "").replace(/\s+/g, "");
const outDir = path.join(ROOT, "ops", "outbox-founder", "carmel-invoice-2026-09-07");
fs.mkdirSync(outDir, { recursive: true });

const client = new ImapFlow({
  host: "imap.gmail.com",
  port: 993,
  secure: true,
  auth: { user, pass },
  logger: false,
});

await client.connect();
const lock = await client.getMailboxLock("INBOX", { readOnly: true });
try {
  const uids = await client.search(
    { gmailRaw: "from:carmelton subject:החשבונית newer_than:7d" },
    { uid: true }
  );
  const targetUid = uids[uids.length - 1];
  if (!targetUid) throw new Error("email not found");

  const msg = await client.fetchOne(String(targetUid), { source: true, envelope: true }, { uid: true });
  const raw = msg.source.toString("utf8");
  fs.writeFileSync(path.join(outDir, "raw.eml"), msg.source);

  const htmlPart = raw.match(/Content-Type: text\/html[\s\S]*?\r?\n\r?\n([\s\S]*?)(?:\r?\n--|$)/i)?.[1] || "";
  const textPart = raw.match(/Content-Type: text\/plain[\s\S]*?\r?\n\r?\n([\s\S]*?)(?:\r?\n--|$)/i)?.[1] || "";
  const text = `${stripHtml(htmlPart)}\n${decodeQuotedPrintable(textPart)}`;

  const amounts = new Set();
  for (const m of text.matchAll(/₪\s*([\d,]+(?:\.\d{1,2})?)/g)) amounts.add(m[1]);
  for (const m of text.matchAll(/([\d,]+(?:\.\d{1,2})?)\s*₪/g)) amounts.add(m[1]);
  for (const m of text.matchAll(/(?:סכום|לתשלום|סה\"כ|חיוב)[^0-9]{0,40}([\d,]+(?:\.\d{1,2})?)/gi))
    amounts.add(m[1]);

  const pdfs = extractPdfParts(raw);
  let pdfPath = null;
  if (pdfs.length) {
    pdfPath = path.join(outDir, pdfs[0].filename.replace(/[^\w.\-()א-ת ]/g, "_"));
    fs.writeFileSync(pdfPath, pdfs[0].content);
  }

  fs.writeFileSync(path.join(outDir, "body.txt"), text.slice(0, 12000), "utf8");

  console.log(
    JSON.stringify(
      {
        ok: true,
        uid: targetUid,
        date: msg.envelope?.date,
        subject: msg.envelope?.subject,
        from: msg.envelope?.from?.[0]?.address,
        amounts: [...amounts],
        textSnippet: text.slice(0, 1000),
        pdf: pdfPath,
        pdfCount: pdfs.length,
      },
      null,
      2
    )
  );
} finally {
  lock.release();
  await client.logout();
}
