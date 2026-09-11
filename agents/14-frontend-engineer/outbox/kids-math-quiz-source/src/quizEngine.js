export const TOTAL = 10;

export const OP_LABELS = {
  add: 'חיבור',
  sub: 'חיסור',
  mul: 'כפל',
};

export const DIFF_LABELS = {
  easy: 'קל',
  medium: 'בינוני',
  hard: 'מתקדם',
};

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

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function q(a, b, sym, answer) {
  return { text: `${a} ${sym} ${b} = ?`, answer };
}

export function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function makeOptions(correct) {
  const opts = new Set([correct]);
  let attempts = 0;
  while (opts.size < 4 && attempts < 50) {
    attempts++;
    const delta = rand(1, Math.max(3, Math.floor(correct * 0.3) + 2));
    const candidate = correct + (Math.random() > 0.5 ? delta : -delta);
    if (candidate >= 0) opts.add(candidate);
    if (opts.size < 4) {
      const near = correct + rand(-5, 5);
      if (near >= 0) opts.add(near);
    }
  }
  return shuffle([...opts]);
}

/**
 * Pool has 9 templates (3 ops × 3 difficulties). Prior build picked all 9 then
 * slice(0, 10) → Q10 was undefined. Pick 2/op + extras, then pad to TOTAL.
 */
export function buildQuestions() {
  const byOp = { add: [], sub: [], mul: [] };
  QUESTION_POOL.forEach((t) => byOp[t.op].push(t));

  const diffOrder = { easy: 0, medium: 1, hard: 2 };
  const picked = [];
  ['add', 'sub', 'mul'].forEach((op) => {
    const sorted = shuffle(byOp[op]).sort(
      (a, b) => diffOrder[a.diff] - diffOrder[b.diff],
    );
    picked.push(sorted[0], sorted[1]);
  });

  let selected = [
    ...picked,
    ...shuffle(QUESTION_POOL.filter((t) => !picked.includes(t))),
  ];

  while (selected.length < TOTAL) {
    selected.push(QUESTION_POOL[Math.floor(Math.random() * QUESTION_POOL.length)]);
  }

  return shuffle(selected)
    .slice(0, TOTAL)
    .map((t) => {
      const item = t.gen();
      return {
        ...item,
        op: t.op,
        diff: t.diff,
        options: makeOptions(item.answer),
      };
    });
}

export function emptyStats() {
  return {
    add: { ok: 0, total: 0 },
    sub: { ok: 0, total: 0 },
    mul: { ok: 0, total: 0 },
  };
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

  const ranked = ['add', 'sub', 'mul']
    .filter((op) => stats[op].total > 0)
    .map((op) => ({
      op,
      pct: Math.round((stats[op].ok / stats[op].total) * 100),
      ok: stats[op].ok,
      total: stats[op].total,
    }))
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

  if (avgTime > 0 && avgTime < 5) {
    sentences.push('הקצב שלך מהיר — את/ה חושב/ת על הרגליים!');
  } else if (avgTime > 12) {
    sentences.push('לקחת/ה את הזמן לחשוב — זה סימן לחשיבה יסודית, מעולה!');
  }

  return sentences.slice(0, 3).join(' ');
}
