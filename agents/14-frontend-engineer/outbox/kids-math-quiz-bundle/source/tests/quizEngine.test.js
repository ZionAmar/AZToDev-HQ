import test from 'node:test';
import assert from 'node:assert/strict';
import { buildQuestions, TOTAL } from '../src/quizEngine.js';

test('buildQuestions always returns exactly 10 items', () => {
  for (let i = 0; i < 200; i++) {
    const questions = buildQuestions();
    assert.equal(questions.length, TOTAL, `run ${i + 1}: expected ${TOTAL}, got ${questions.length}`);
    questions.forEach((q, idx) => {
      assert.ok(q.text, `question ${idx + 1} missing text`);
      assert.ok(typeof q.answer === 'number', `question ${idx + 1} missing numeric answer`);
      assert.ok(q.op, `question ${idx + 1} missing op`);
      assert.ok(q.diff, `question ${idx + 1} missing diff`);
      assert.equal(q.options.length, 4, `question ${idx + 1} must have 4 options`);
      assert.ok(q.options.includes(q.answer), `question ${idx + 1} options must include answer`);
    });
  }
});
