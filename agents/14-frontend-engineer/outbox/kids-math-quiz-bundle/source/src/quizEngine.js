export const TOTAL_QUESTIONS = 10;

export const OP_LABELS = { add: 'חיבור', sub: 'חיסור', mul: 'כפל' };
export const DIFF_LABELS = { easy: 'קל', medium: 'בינוני', hard: 'מתקדם' };

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function q(a, b, sym, answer) {
  return { text: `${a} ${sym} ${b} = ?`, answer };
}

// Ages ~6-10: addition, subtraction, multiplication (no division, to stay
// friendly for younger kids and keep answers whole numbers without remainders).
const QUESTION_POOL = [
  { op: 'add', diff: 'easy', gen: () => { const a = rand(1, 9), b = rand(1, 9); return q(a, b, '+', a + b); } },
  { op: 'add', diff: 'medium', gen: () => { const a = rand(10, 49), b = rand(10, 49); return q(a, b, '+', a + b); } },
  { op: 'add', diff: 'hard', gen: () => { const a = rand(50, 99), b = rand(10, 99); return q(a, b, '+', a + b); } },
  { op: 'sub', diff: 'easy', gen: () => { const a = rand(5, 15), b = rand(1, a); return q(a, b, '−', a - b); } },
  { op: 'sub', diff: 'medium', gen: () => { const a = rand(20, 80), b = rand(5, a); return q(a, b, '−', a - b); } },
  { op: 'sub', diff: 'hard', gen: () => { const a = rand(80, 150), b = rand(20, a); return q(a, b, '−', a - b); } },
  { op: 'mul', diff: 'easy', gen: () => { const a = rand(2, 5), b = rand(2, 5); return q(a, b, '×', a * b); } },
  { op: 'mul', diff: 'medium', gen: () => { const a = rand(3, 9), b = rand(3, 9); return q(a, b, '×', a * b); } },
  { op: 'mul', diff: 'hard', gen: () => { const a = rand(6, 12), b = rand(6, 12); return q(a, b, '×', a * b); } },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeOptions(correct) {
  const opts = new Set([correct]);
  let guard = 0;
  while (opts.size < 4 && guard < 50) {
    guard++;
    const delta = rand(1, Math.max(3, Math.floor(correct * 0.3) + 2));
    const candidate = correct + (Math.random() > 0.5 ? delta : -delta);
    if (candidate >= 0) opts.add(candidate);
    if (opts.size < 4) {
      const c2 = correct + rand(-5, 5);
      if (c2 >= 0) opts.add(c2);
    }
  }
  return shuffle([...opts]);
}

export function buildQuestions() {
  const byOp = { add: [], sub: [], mul: [] };
  QUESTION_POOL.forEach((t) => byOp[t.op].push(t));

  const diffRank = { easy: 0, medium: 1, hard: 2 };
  const templates = [];
  ['add', 'sub', 'mul'].forEach((op) => {
    const sorted = shuffle(byOp[op]).sort((a, b) => diffRank[a.diff] - diffRank[b.diff]);
    templates.push(sorted[0], sorted[1], sorted[2]);
  });

  // Pool has 9 unique templates (3 ops × 3 difficulties). Reuse random templates for #10+
  // — gen() produces fresh numbers each call, so reuse is safe and keeps op coverage.
  while (templates.length < TOTAL_QUESTIONS) {
    templates.push(QUESTION_POOL[rand(0, QUESTION_POOL.length - 1)]);
  }

  return shuffle(templates)
    .slice(0, TOTAL_QUESTIONS)
    .map((t) => {
      const item = t.gen();
      item.op = t.op;
      item.diff = t.diff;
      item.options = makeOptions(item.answer);
      return item;
    });
}

export function emptyStats() {
  return { add: { ok: 0, total: 0 }, sub: { ok: 0, total: 0 }, mul: { ok: 0, total: 0 } };
}

export function scoreTitle(score) {
  if (score >= 9) return '🏆 אלוף/ת מתמטיקה!';
  if (score >= 7) return '🌟 כל הכבוד!';
  if (score >= 5) return '👍 יפה מאוד!';
  return '💪 המשיכ/י להתאמן!';
}

export function buildInsight(score, stats, times) {
  const sentences = [];
  const avgTime = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;

  if (score >= 9) sentences.push('ביצוע מעולה! יש לך בסיס מתמטי חזק מאוד.');
  else if (score >= 7) sentences.push('עבודה יפה! את/ה בדרך הנכונה ומראה/ה הבנה טובה.');
  else if (score >= 5) sentences.push('התחלה טובה — עם קצת תרגול תשתפר/י מהר.');
  else sentences.push('אל תדאג/י — מתמטיקה משתפרת עם תרגול קבוע וכיף!');

  const ops = ['add', 'sub', 'mul'];
  const ranked = ops
    .filter((o) => stats[o].total > 0)
    .map((o) => ({ op: o, pct: Math.round((stats[o].ok / stats[o].total) * 100), ok: stats[o].ok, total: stats[o].total }))
    .sort((a, b) => b.pct - a.pct);

  if (ranked.length >= 2) {
    const best = ranked[0];
    const worst = ranked[ranked.length - 1];
    if (best.pct === 100 && best.total >= 2) {
      sentences.push(`ממש חזק/ה ב${OP_LABELS[best.op]} — ${best.ok} מתוך ${best.total} נכון!`);
    } else if (best.pct >= 75) {
      sentences.push(`בולט/ת במיוחד ב${OP_LABELS[best.op]} (${best.ok}/${best.total}).`);
    }
    if (worst.pct < 100 && worst.total >= 1 && worst.op !== best.op) {
      if (worst.pct === 0) {
        sentences.push(`כדאי לתרגל עוד ${OP_LABELS[worst.op]} — ננסה שוב בפעם הבאה!`);
      } else {
        sentences.push(`${OP_LABELS[worst.op]} דורש/ת קצת יותר תרגול (${worst.ok}/${worst.total}).`);
      }
    }
  }

  if (avgTime > 0 && avgTime < 5) sentences.push('הקצב שלך מהיר — את/ה חושב/ת על הרגליים!');
  else if (avgTime > 12) sentences.push('לקחת/ה את הזמן לחשוב — זה סימן לחשיבה יסודית, מעולה!');

  return sentences.slice(0, 3).join(' ');
}
