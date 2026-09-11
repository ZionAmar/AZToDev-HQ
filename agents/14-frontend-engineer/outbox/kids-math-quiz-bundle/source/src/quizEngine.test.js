import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildQuestions, TOTAL_QUESTIONS } from './quizEngine.js';

describe('buildQuestions', () => {
  it('always returns exactly TOTAL_QUESTIONS valid items (200 stochastic runs)', () => {
    for (let i = 0; i < 200; i++) {
      const questions = buildQuestions();
      assert.equal(
        questions.length,
        TOTAL_QUESTIONS,
        `run ${i + 1}: expected ${TOTAL_QUESTIONS}, got ${questions.length}`,
      );
      questions.forEach((q, idx) => {
        assert.ok(q.text, `run ${i + 1} q${idx}: missing text`);
        assert.ok(Number.isFinite(q.answer), `run ${i + 1} q${idx}: invalid answer`);
        assert.equal(q.options.length, 4, `run ${i + 1} q${idx}: expected 4 options`);
        assert.ok(q.options.includes(q.answer), `run ${i + 1} q${idx}: answer not in options`);
      });
    }
  });
});
