import test from 'node:test';
import assert from 'node:assert/strict';
import { buildQuestions, TOTAL } from './quizEngine.js';

test('buildQuestions always returns exactly TOTAL valid questions (200 runs)', () => {
  for (let i = 0; i < 200; i++) {
    const questions = buildQuestions();
    assert.equal(questions.length, TOTAL, `run ${i}: expected ${TOTAL}, got ${questions.length}`);
    questions.forEach((q, idx) => {
      assert.ok(q, `run ${i} Q${idx + 1}: question is undefined`);
      assert.notEqual(q.answer, undefined, `run ${i} Q${idx + 1}: answer undefined`);
      assert.ok(q.text, `run ${i} Q${idx + 1}: missing text`);
      assert.ok(Array.isArray(q.options) && q.options.length >= 2);
      assert.ok(q.options.includes(q.answer), `run ${i} Q${idx + 1}: answer not in options`);
    });
  }
});
