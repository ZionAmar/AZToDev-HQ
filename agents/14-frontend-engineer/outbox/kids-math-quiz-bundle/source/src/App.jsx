import { useMemo, useRef, useState } from 'react';
import {
  TOTAL,
  OP_LABELS,
  DIFF_LABELS,
  buildQuestions,
  emptyStats,
  scoreTitle,
  buildInsight,
} from './quizEngine.js';
import './App.css';

function QuizScreen({ question, index, onAnswer }) {
  const [chosen, setChosen] = useState(null);
  const [answered, setAnswered] = useState(false);

  const pick = (value) => {
    if (answered) return;
    setChosen(value);
    setAnswered(true);
  };

  const next = () => {
    const correct = chosen === question.answer;
    setChosen(null);
    setAnswered(false);
    onAnswer(correct);
  };

  const progress = (index / TOTAL) * 100;
  const isCorrect = chosen === question.answer;

  return (
    <div className="card" id="quiz-screen">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="progress-label">
        שאלה {index + 1} מתוך {TOTAL}
      </p>
      <span className="question-badge">
        {OP_LABELS[question.op]} · {DIFF_LABELS[question.diff]}
      </span>
      <p className="question-text">{question.text}</p>
      <div className="answers">
        {question.options.map((opt) => {
          let cls = 'answer-btn';
          if (answered && opt === question.answer) cls += ' correct';
          else if (answered && opt === chosen) cls += ' wrong';
          return (
            <button key={opt} className={cls} disabled={answered} onClick={() => pick(opt)}>
              {opt}
            </button>
          );
        })}
      </div>
      <p className={`feedback ${answered ? (isCorrect ? 'ok' : 'no') : ''}`}>
        {answered ? (isCorrect ? '🌟 מצוין!' : `💪 התשובה הנכונה: ${question.answer}`) : ''}
      </p>
      {answered && (
        <button className="next-btn" onClick={next}>
          {index < TOTAL - 1 ? 'השאלה הבאה ←' : 'ראו את התוצאות! 🎉'}
        </button>
      )}
    </div>
  );
}

function ResultsScreen({ score, stats, times, onRestart }) {
  const insight = useMemo(() => buildInsight(score, stats, times), [score, stats, times]);
  const breakdownOps = ['add', 'sub', 'mul'].filter((op) => stats[op].total > 0);

  return (
    <div className="card results" id="results-screen">
      <div className="score-circle">
        <span className="num">{score}</span>
        <span className="den">מתוך {TOTAL}</span>
      </div>
      <p className="score-title">{scoreTitle(score)}</p>
      <div className="insight-box">
        <h3>💡 מה למדנו עליך</h3>
        <p>{insight}</p>
      </div>
      <div className="breakdown">
        {breakdownOps.map((op) => (
          <div key={op} className="breakdown-item">
            <strong>{OP_LABELS[op]}</strong>
            {stats[op].ok}/{stats[op].total} נכון
          </div>
        ))}
      </div>
      <button className="restart-btn" onClick={onRestart}>
        🔄 נסו שוב!
      </button>
    </div>
  );
}

export default function App() {
  const [questions, setQuestions] = useState(() => buildQuestions());
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [stats, setStats] = useState(() => emptyStats());
  const [times, setTimes] = useState([]);
  const [finished, setFinished] = useState(false);
  const questionStart = useRef(Date.now());

  const restart = () => {
    setQuestions(buildQuestions());
    setIndex(0);
    setScore(0);
    setStats(emptyStats());
    setTimes([]);
    setFinished(false);
    questionStart.current = Date.now();
  };

  const handleAnswer = (correct) => {
    const q = questions[index];
    const elapsed = (Date.now() - questionStart.current) / 1000;
    setTimes((prev) => [...prev, elapsed]);
    setStats((prev) => ({
      ...prev,
      [q.op]: { ok: prev[q.op].ok + (correct ? 1 : 0), total: prev[q.op].total + 1 },
    }));
    if (correct) setScore((s) => s + 1);

    const nextIndex = index + 1;
    if (nextIndex >= TOTAL) {
      setFinished(true);
    } else {
      setIndex(nextIndex);
      questionStart.current = Date.now();
    }
  };

  return (
    <div className="container">
      <header>
        <h1>🎯 שאלון מתמטיקה</h1>
        <p>{TOTAL} שאלות — בואו נראה כמה אתם חזקים!</p>
      </header>
      {finished ? (
        <ResultsScreen score={score} stats={stats} times={times} onRestart={restart} />
      ) : (
        <QuizScreen question={questions[index]} index={index} onAnswer={handleAnswer} />
      )}
    </div>
  );
}
