import fs from "fs";
import path from "path";
import {
  STATE_PATH,
  STATUS_PATH,
  OPS,
  ensureRuntimeDirs,
  readJson,
  writeJson,
  nowIso,
  journal,
  listIntakeFiles,
} from "./paths.mjs";
import { saveCheckpoint } from "./checkpoint.mjs";
import { ensureMemory } from "./shared-memory.mjs";
import { runIntakeMeeting, runDailyMeeting } from "./orchestrator.mjs";
import { pollFounderMessages, sendFounderTelegram, telegramConfigured } from "./telegram.mjs";
import { sendEndOfDayDigest } from "./digest.mjs";
import { llmConfigured } from "./llm.mjs";
import { extractFounderPush } from "./front-desk-push.mjs";
import { enqueueFounderTelegram } from "./telegram-queue.mjs";
import { reapAgentSpawnedConsoles } from "./cleanup-consoles.mjs";

function jerusalemHour() {
  try {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jerusalem",
      hour: "2-digit",
      hour12: false,
    });
    return Number(fmt.format(new Date()));
  } catch {
    return new Date().getHours();
  }
}

function jerusalemDate() {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jerusalem",
    }).format(new Date());
  } catch {
    return nowIso().slice(0, 10);
  }
}

/**
 * Poll Telegram and enqueue into Nura's Cursor session queue.
 * Safe to call from a fast interval even while the main tick is busy.
 */
export async function pollAndEnqueueTelegram(markAgent = null, decisions = null) {
  if (!telegramConfigured()) return 0;
  try {
    const msgs = await pollFounderMessages();
    let n = 0;
    for (const m of msgs) {
      const text = (m.text || "").trim();
      const hasAtt = Array.isArray(m.attachments) && m.attachments.length > 0;
      if (!text && !hasAtt) continue;
      if (markAgent) {
        markAgent(
          "00-ceo",
          `Telegram: ${(text || "[media]").slice(0, 50)}`,
          "active"
        );
      }
      enqueueFounderTelegram(m);
      if (decisions) {
        decisions.unshift({
          at: jerusalemDate(),
          by: "00-ceo",
          text: `Telegram → Nura: ${(text || "[media]").slice(0, 80)}`,
        });
      }
      n += 1;
    }
    return n;
  } catch (err) {
    journal("telegram_poll_error", { message: String(err?.message || err) });
    return 0;
  }
}

/**
 * Async engine tick — Parity+ heartbeat.
 */
export async function tick(status) {
  ensureRuntimeDirs();
  ensureMemory();
  const state = readJson(STATE_PATH, {});
  const cursor = status.cursor || {
    processedIdeas: [],
    processedProblems: [],
    lastTickAt: null,
    resumeNote: "",
    lastDailyDate: null,
    lastEodDate: null,
  };

  const ideas = listIntakeFiles("ideas");
  const problems = listIntakeFiles("problems");
  const newIdeas = ideas.filter((f) => !cursor.processedIdeas.includes(f.name));
  const newProblems = problems.filter(
    (f) => !cursor.processedProblems.includes(f.name)
  );

  const decisions = Array.isArray(state.recentDecisions)
    ? state.recentDecisions.slice(0, 20)
    : [];
  const agentsNow = Array.isArray(state.agentsNow) ? [...state.agentsNow] : [];
  const meetings = Array.isArray(state.recentMeetings)
    ? state.recentMeetings.slice(0, 20)
    : [];

  const markAgent = (id, doing, agentStatus = "active") => {
    const i = agentsNow.findIndex((a) => a.id === id);
    if (i >= 0) agentsNow[i] = { ...agentsNow[i], status: agentStatus, doing };
  };

  // Telegram poll is handled by the fast tgTimer in emet.mjs (avoid dual getUpdates conflict).
  // await pollAndEnqueueTelegram(markAgent, decisions);

  // Auto intake meetings are OFF by default — Nura's Cursor session orchestrates.
  // Set EMET_AUTO_INTAKE_MEETINGS=true to restore Parity+ meeting swarm on new ideas.
  const autoIntake = process.env.EMET_AUTO_INTAKE_MEETINGS === "true";

  // --- New ideas → Intake meeting (optional) ---
  for (const file of newIdeas) {
    cursor.processedIdeas.push(file.name);
    const ideaText = fs.readFileSync(file.path, "utf8").slice(0, 2000);
    decisions.unshift({
      at: jerusalemDate(),
      by: "00-ceo",
      text: autoIntake
        ? `IDEA ${file.name} → Intake meeting starting`
        : `IDEA ${file.name} logged (Nura session owns execution; auto-meeting off)`,
    });
    markAgent("00-ceo", `Aware of ${file.name}`, "active");

    state.initiatives = state.initiatives || [];
    const id = file.name.replace(/\.md$/i, "");
    if (!state.initiatives.some((x) => x.id === id)) {
      state.initiatives.push({
        id,
        title: id,
        stage: "intake",
        status: "active",
        todayGoal: autoIntake
          ? "Complete Intake — no coding yet"
          : "Owned by Nura Telegram/Cursor session",
        owners: ["00-ceo", "04-cpo", "07-product-manager", "03-cto"],
        sourceFile: `ops/intake/ideas/${file.name}`,
      });
    }

    if (!autoIntake) continue;

    markAgent("07-product-manager", `Intake support ${file.name}`, "active");
    markAgent("04-cpo", `Shaping problem for ${file.name}`, "active");
    markAgent("03-cto", `Risk skim for ${file.name}`, "ready");

    try {
      const meeting = await runIntakeMeeting(ideaText, id);
      meetings.unshift({
        at: jerusalemDate(),
        type: "intake",
        title: id,
      });
      const push = extractFounderPush(meeting.telegramSummary || meeting.decisions);
      if (push) {
        await sendFounderTelegram(`EMET | נורה | שער\n${id}\n\n${push}`);
      }
    } catch (err) {
      journal("intake_meeting_error", { file: file.name, error: String(err?.message || err) });
    }
  }

  for (const file of newProblems) {
    cursor.processedProblems.push(file.name);
    decisions.unshift({
      at: jerusalemDate(),
      by: "28-support",
      text: `PROBLEM ${file.name} queued for triage`,
    });
    markAgent("28-support", `Triage ${file.name}`, "active");
    markAgent("20-qa-sdet", `Validate ${file.name}`, "ready");
  }

  // --- Daily at ~09:00 Jerusalem once per day ---
  const hour = jerusalemHour();
  const today = jerusalemDate();
  if (hour >= 9 && hour < 10 && cursor.lastDailyDate !== today) {
    try {
      markAgent("32-delivery-lead", "Running Daily meeting", "active");
      const daily = await runDailyMeeting();
      cursor.lastDailyDate = today;
      meetings.unshift({ at: today, type: "daily", title: "Daily Parity+" });
      decisions.unshift({
        at: today,
        by: "32-delivery-lead",
        text: "Daily meeting completed (or stubbed if no LLM key)",
      });
      if (daily.ok && daily.telegramSummary) {
        // daily usually no spam — only if waiting founder lines exist
      }
    } catch (err) {
      journal("daily_error", { error: String(err?.message || err) });
    }
  }

  // --- EOD ~20:00 Jerusalem ---
  if (hour >= 20 && hour < 21 && cursor.lastEodDate !== today) {
    try {
      await sendEndOfDayDigest();
      cursor.lastEodDate = today;
      decisions.unshift({
        at: today,
        by: "00-ceo",
        text: "End-of-day digest sent/queued to founder Telegram",
      });
    } catch (err) {
      journal("eod_error", { error: String(err?.message || err) });
    }
  }

  cursor.lastTickAt = nowIso();
  cursor.resumeNote = `Parity+ tick. LLM=${llmConfigured()} TG=${telegramConfigured()} ideas=${cursor.processedIdeas.length}`;

  // Periodic orphan CMD reap (every ~3 ticks ≈ 15s) so leftovers cannot pile up
  const ticksPreview = (state.runtime?.ticks || 0) + 1;
  if (ticksPreview % 3 === 0) {
    try {
      await reapAgentSpawnedConsoles();
    } catch {
      /* ignore */
    }
  }

  state.updatedAt = nowIso();
  state.recentDecisions = decisions.slice(0, 30);
  state.recentMeetings = meetings.slice(0, 20);
  state.agentsNow = agentsNow;
  state.power = "on";
  state.runtime = {
    ...(state.runtime || {}),
    lastTickAt: cursor.lastTickAt,
    resumeNote: cursor.resumeNote,
    ticks: (state.runtime?.ticks || 0) + 1,
    parity: {
      llm: llmConfigured(),
      telegram: telegramConfigured(),
    },
  };

  writeJson(STATE_PATH, state);
  status.cursor = cursor;
  status.lastTickAt = cursor.lastTickAt;
  status.heartbeatAt = nowIso();
  writeJson(STATUS_PATH, status);

  const ticks = state.runtime.ticks || 0;
  if (newIdeas.length || newProblems.length || ticks % 10 === 0) {
    saveCheckpoint(newIdeas.length || newProblems.length ? "intake-change" : "periodic");
  }

  return { newIdeas: newIdeas.length, newProblems: newProblems.length, ticks };
}

export function markPowerOffOnState(reason) {
  const state = readJson(STATE_PATH, {});
  state.power = "off";
  state.updatedAt = nowIso();
  state.runtime = {
    ...(state.runtime || {}),
    stoppedAt: nowIso(),
    stopReason: reason,
    resumeNote: "Paused — will resume from checkpoint on next ON",
  };
  if (Array.isArray(state.agentsNow)) {
    state.agentsNow = state.agentsNow.map((a) => ({
      ...a,
      status: a.status === "active" ? "paused" : a.status,
      doing: a.status === "active" ? `PAUSED — was: ${a.doing}` : a.doing,
    }));
  }
  writeJson(STATE_PATH, state);
}
