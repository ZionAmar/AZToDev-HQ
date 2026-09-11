import test from 'node:test';
import assert from 'node:assert/strict';
import { buildQuestions, TOTAL_QUESTIONS } from './quizEngine.js';

test('buildQuestions always returns exactly TOTAL_QUESTIONS valid items', () => {
  for (let run = 0; run < 200; run++) {
    const questions = buildQuestions();
    assert.equal(questions.length, TOTAL_QUESTIONS, `run ${run}: expected ${TOTAL_QUESTIONS} questions`);
    questions.forEach((q, i) => {
      assert.ok(q.text, `run ${run} q${i}: missing text`);
      assert.equal(typeof q.answer, 'number', `run ${run} q${i}: answer must be number`);
      assert.ok(Array.isArray(q.options) && q.options.length === 4, `run ${run} q${i}: need 4 options`);
      assert.ok(q.options.includes(q.answer), `run ${run} q${i}: correct answer not in options`);
    });
  }
});
