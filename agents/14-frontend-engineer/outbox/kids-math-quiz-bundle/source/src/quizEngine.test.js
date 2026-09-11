import assert from 'node:assert/strict';
import test from 'node:test';
import { buildQuestions, TOTAL_QUESTIONS } from './quizEngine.js';

test('buildQuestions always returns exactly TOTAL_QUESTIONS items (200 stochastic runs)', () => {
  for (let i = 0; i < 200; i++) {
    const questions = buildQuestions();
    assert.equal(
      questions.length,
      TOTAL_QUESTIONS,
      `run ${i}: expected ${TOTAL_QUESTIONS} questions, got ${questions.length}`,
    );
    questions.forEach((q, idx) => {
      assert.ok(q.text, `run ${i} q${idx}: missing text`);
      assert.ok(q.options?.length >= 2, `run ${i} q${idx}: need answer options`);
      assert.ok(q.options.includes(q.answer), `run ${i} q${idx}: answer not in options`);
    });
  }
});
