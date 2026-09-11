import test from 'node:test';
import assert from 'node:assert/strict';
import { buildQuestions, TOTAL_QUESTIONS } from '../src/quizEngine.js';

const RUNS = 200;

test(`buildQuestions returns exactly ${TOTAL_QUESTIONS} valid questions (${RUNS} stochastic runs)`, () => {
  for (let run = 0; run < RUNS; run++) {
    const questions = buildQuestions();
    assert.equal(
      questions.length,
      TOTAL_QUESTIONS,
      `run ${run + 1}: expected ${TOTAL_QUESTIONS} questions, got ${questions.length}`,
    );
    questions.forEach((q, i) => {
      assert.ok(q.text, `run ${run + 1} Q${i + 1}: missing text`);
      assert.equal(typeof q.answer, 'number', `run ${run + 1} Q${i + 1}: answer must be number`);
      assert.ok(['add', 'sub', 'mul'].includes(q.op), `run ${run + 1} Q${i + 1}: invalid op`);
      assert.equal(q.options.length, 4, `run ${run + 1} Q${i + 1}: expected 4 options`);
      assert.ok(q.options.includes(q.answer), `run ${run + 1} Q${i + 1}: correct answer not in options`);
    });
  }
});
