import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const questions = [
  {
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correct: 2
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correct: 1
  },
  {
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correct: 1
  },
  {
    question: 'Who painted the Mona Lisa?',
    options: ['Van Gogh', 'Picasso', 'Da Vinci', 'Monet'],
    correct: 2
  },
  {
    question: 'What is the largest ocean?',
    options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    correct: 3
  }
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (index: number) => {
    setSelected(index);
    if (index === questions[current].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="space-y-4 py-4 text-center">
        <h2 className="text-2xl font-bold">Quiz Complete!</h2>
        <p className="text-xl">Your Score: {score} / {questions.length}</p>
        <Button onClick={reset}>Play Again</Button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="space-y-4 py-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Question {current + 1} of {questions.length}</p>
        <h3 className="text-xl font-semibold mt-2">{q.question}</h3>
      </div>
      <div className="space-y-2 max-w-md mx-auto">
        {q.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={selected !== null}
            className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
              selected === i
                ? i === q.correct
                  ? 'bg-green-500/20 border-green-500'
                  : 'bg-red-500/20 border-red-500'
                : 'bg-card border-border hover:bg-accent'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {selected !== null && (
        <div className="text-center">
          <Button onClick={handleNext}>
            {current < questions.length - 1 ? 'Next Question' : 'See Results'}
          </Button>
        </div>
      )}
    </div>
  );
}
