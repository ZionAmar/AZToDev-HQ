const STAGES = [
  "intake", "discover", "shape", "architect", "plan",
  "build", "harden", "stage", "launch", "learn", "grow"
];

const STAGE_HE = {
  intake: "קליטה",
  discover: "גילוי",
  shape: "עיצוב",
  architect: "ארכיטקטורה",
  plan: "תכנון",
  build: "בנייה",
  harden: "חיזוק",
  stage: "סטייג׳ינג",
  launch: "השקה",
  learn: "למידה",
  grow: "צמיחה"
};

async function loadState() {
  const res = await fetch("/ops/state.json?ts=" + Date.now());
  if (!res.ok) throw new Error("Cannot load ops/state.json");
  return res.json();
}

function el(id) { return document.getElementById(id); }

function render(state) {
  el("motto").textContent = state.motto || "";
  el("updated").textContent = "עודכן: " + (state.updatedAt || "—");

  const fa = state.founderAttention || { waiting: [] };
  const box = el("founderBox");
  const host = el("founderAttention");
  if (!fa.waiting || fa.waiting.length === 0) {
    box.classList.add("empty");
    host.innerHTML = `<p>${fa.note || "אין ממתינים לאישור המייסד."}</p>`;
  } else {
    box.classList.remove("empty");
    host.innerHTML = `<ul>${fa.waiting.map((w) =>
      `<li><strong>${w.id || ""}</strong> — ${w.ask}</li>`
    ).join("")}</ul>`;
  }

  const today = state.today || {};
  el("todayDate").textContent = today.date || "";
  el("todayFocus").innerHTML = (today.focus || []).map((x) => `<li>${x}</li>`).join("") || "<li>—</li>";
  el("notDoing").innerHTML = (today.notDoing || []).map((x) => `<li>${x}</li>`).join("") || "<li>—</li>";
  el("dayOwners").textContent =
    `תכנון יום: ${today.dayPlanOwner || "—"} · פסיליטציה: ${today.facilitator || "—"}`;

  el("agentsNow").innerHTML = (state.agentsNow || []).map((a) => `
    <div class="agent">
      <img class="agent-photo" src="/agents/${a.id}/avatar.svg" alt="" width="36" height="36" />
      <div class="dot ${a.status || "idle"}"></div>
      <div>
        <strong>${a.name} <span style="color:var(--muted);font-weight:400">(${a.id})</span></strong>
        <span>${a.doing || ""}</span>
      </div>
    </div>
  `).join("") || `<div class="empty">אין פעילות</div>`;

  el("stagesLegend").innerHTML = STAGES.map((s) =>
    `<span>${STAGE_HE[s]}</span>`
  ).join("");

  const initiatives = state.initiatives || [];
  if (!initiatives.length) {
    el("initiatives").innerHTML = `
      <div class="empty">
        אין יוזמות פעילות עדיין.<br/>
        זרוק רעיון ל־<code>ops/intake/ideas/</code> או בעיה ל־<code>ops/intake/problems/</code>
        — ואז רצה ישיבת Intake לפי הכללים.
      </div>`;
  } else {
    el("initiatives").innerHTML = initiatives.map((init) => {
      const idx = Math.max(0, STAGES.indexOf(init.stage));
      const bars = STAGES.map((s, i) => {
        const cls = i < idx ? "on" : i === idx ? "current" : "";
        return `<i class="${cls}" title="${s}"></i>`;
      }).join("");
      return `
        <div class="initiative">
          <header>
            <div>
              <strong>${init.title}</strong>
              <div class="meta">${init.id} · ${init.status || "active"}</div>
            </div>
            <span class="badge">${STAGE_HE[init.stage] || init.stage}</span>
          </header>
          <div class="meta">היום: ${init.todayGoal || "—"}</div>
          <div class="meta">בעלים: ${(init.owners || []).join(", ") || "—"}</div>
          <div class="stage-bar">${bars}</div>
        </div>`;
    }).join("");
  }

  el("decisions").innerHTML = (state.recentDecisions || []).map((d) =>
    `<li><strong>${d.at}</strong> — ${d.text} <span class="meta">(${d.by})</span></li>`
  ).join("") || "<li>אין עדיין</li>";

  el("meetings").innerHTML = (state.recentMeetings || []).length
    ? state.recentMeetings.map((m) =>
        `<li><strong>${m.at}</strong> — ${m.type}: ${m.title}</li>`
      ).join("")
    : "<li>עדיין לא התקיימו ישיבות — הראשונה תהיה Intake</li>";
}

async function loadPrefs() {
  try {
    const res = await fetch("/ops/founder-prefs.json?ts=" + Date.now());
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function loadStatus() {
  try {
    const res = await fetch("/api/status?ts=" + Date.now());
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function renderPower(status, state) {
  const badge = el("powerBadge");
  const note = el("resumeNote");
  const power = status?.power || state?.power || "unknown";
  badge.textContent = "POWER " + String(power).toUpperCase();
  badge.className = "power " + (power === "on" ? "on" : "off");
  const resume =
    status?.cursor?.resumeNote ||
    status?.checkpoint?.resumeNote ||
    state?.runtime?.resumeNote ||
    "";
  const cp = status?.checkpoint?.savedAt
    ? ` · checkpoint: ${status.checkpoint.savedAt}`
    : "";
  note.textContent = resume + cp;
}

async function postPower(action) {
  const res = await fetch("/api/power", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  return res.json();
}

async function boot() {
  try {
    const [state, prefs, status] = await Promise.all([
      loadState(),
      loadPrefs(),
      loadStatus(),
    ]);
    render(state);
    renderPower(status, state);
    const kb = el("keyBadge");
    if (kb) {
      if (status?.cursorApiKey) {
        kb.textContent = "CURSOR_API_KEY ✓";
        kb.className = "key-badge ok";
      } else {
        kb.textContent = "חסר CURSOR_API_KEY — הפרומפט יישמר להרצה ידנית";
        kb.className = "key-badge";
      }
    }
    if (prefs && el("founderMeta")) {
      const q = prefs.quietHours || {};
      el("founderMeta").textContent =
        `מייסד: ${prefs.founder?.name || "ציון"} · שקט ${q.start || "21:30"}–${q.end || "08:30"} · צ׳אט פנימי = מטה ראשית`;
    }
    await refreshChat();
  } catch (err) {
    el("initiatives").innerHTML = `<div class="empty">שגיאה בטעינה: ${err.message}. הדלק עם EMET-ON.bat</div>`;
  }
}

async function loadChat() {
  const res = await fetch("/api/chat?ts=" + Date.now());
  if (!res.ok) throw new Error("chat load failed");
  return res.json();
}

function renderChat(messages) {
  const log = el("chatLog");
  if (!messages?.length) {
    log.innerHTML = `<div class="empty">עדיין אין הודעות. כתוב בעברית חופשית — זה ינותב לסוכן ויופעל ב־Cursor.</div>`;
    return;
  }
  log.innerHTML = messages.map((m) => {
    const cls = m.role === "founder" ? "founder" : m.role === "agent" ? "agent" : "system";
    const arts = (m.artifacts || [])
      .map((a) => {
        const isImg = /\.(png|jpe?g|webp|gif)$/i.test(a.name);
        if (isImg) return `<a href="${a.url}" target="_blank" rel="noopener"><img src="${a.url}" alt="${a.name}" /></a>`;
        return `<a href="${a.url}" target="_blank" rel="noopener">${a.name}</a>`;
      })
      .join("");
    return `<div class="bubble ${cls}">
      <div class="who">${m.name || m.role}${m.agentId ? " · " + m.agentId : ""}${m.status ? " · " + m.status : ""}</div>
      <div>${escapeHtml(m.text || "")}</div>
      ${arts ? `<div class="arts">${arts}</div>` : ""}
    </div>`;
  }).join("");
  log.scrollTop = log.scrollHeight;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function sendChat() {
  const input = el("chatInput");
  const text = input.value.trim();
  if (!text) return;
  el("btnSend").disabled = true;
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const j = await res.json();
    if (!j.ok) throw new Error(j.error || "send failed");
    input.value = "";
    el("chatHint").textContent = `נשלח אל ${j.route?.agentName || j.route?.agentId} — ממתין לפלט Cursor…`;
    await refreshChat();
  } catch (err) {
    alert("שליחה נכשלה: " + err.message);
  } finally {
    el("btnSend").disabled = false;
  }
}

async function refreshChat() {
  try {
    const data = await loadChat();
    renderChat(data.messages || []);
  } catch {
    /* ignore while off */
  }
}

let mediaRecorder = null;
let chunks = [];
el("btnMic")?.addEventListener("click", async () => {
  const btn = el("btnMic");
  // Prefer Web Speech API for free-language → text (Hebrew)
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR && !btn.classList.contains("recording")) {
    const rec = new SR();
    rec.lang = "he-IL";
    rec.interimResults = true;
    btn.classList.add("recording");
    btn.textContent = "מקליט…";
    rec.onresult = (ev) => {
      let t = "";
      for (let i = 0; i < ev.results.length; i++) t += ev.results[i][0].transcript;
      el("chatInput").value = t;
    };
    rec.onend = () => {
      btn.classList.remove("recording");
      btn.textContent = "הקלטה";
    };
    rec.onerror = () => {
      btn.classList.remove("recording");
      btn.textContent = "הקלטה";
    };
    rec.start();
    return;
  }
  alert("הקלטת דיבור לא נתמכת בדפדפן הזה — כתוב טקסט, או השתמש בכרום.");
});

el("btnSend")?.addEventListener("click", sendChat);
el("chatInput")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) sendChat();
});


el("refresh").addEventListener("click", boot);
el("btnOff").addEventListener("click", async () => {
  if (!confirm("לכבות את EMET ולשמור נקודת חזרה מדויקת?")) return;
  try {
    await postPower("off");
    el("powerBadge").textContent = "POWER OFF";
    el("powerBadge").className = "power off";
    el("resumeNote").textContent = "כבוי — הנקודה נשמרה. להדלקה: EMET-ON.bat";
  } catch {
    alert("הכיבוי דרך הדשבורד נכשל — הרץ EMET-OFF.bat");
  }
});
el("btnCp").addEventListener("click", async () => {
  try {
    const j = await postPower("checkpoint");
    alert("Checkpoint נשמר: " + (j.checkpoint || j.savedAt || "ok"));
    boot();
  } catch {
    alert("שמירה נכשלה");
  }
});
el("btnOn").addEventListener("click", () => {
  alert("להדלקה מהדשבורד הכבוי: הרץ EMET-ON.bat בתיקיית החברה (או node runtime/emet.mjs on). אחרי ההדלקה רענן את הדף.");
});
boot();
setInterval(boot, 15000);
