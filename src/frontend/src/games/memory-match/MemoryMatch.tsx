import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const emojis = ["🎮", "🎨", "🎭", "🎪", "🎯", "🎲", "🎸", "🎹"];

export default function MemoryMatch() {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first] === cards[second]) {
        setMatched((prev) => [...prev, first, second]);
      }
      setTimeout(() => setFlipped([]), 1000);
      setMoves((prev) => prev + 1);
    }
  }, [flipped, cards]);

  const resetGame = () => {
    const shuffled = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  const handleClick = (index: number) => {
    if (
      flipped.length === 2 ||
      flipped.includes(index) ||
      matched.includes(index)
    )
      return;
    setFlipped([...flipped, index]);
  };

  return (
    <div className="space-y-4 py-4">
      <div className="text-center">
        <p className="text-lg font-semibold">Moves: {moves}</p>
        <p className="text-sm text-muted-foreground">Match all pairs to win!</p>
      </div>
      <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
        {cards.map((card, i) => (
          <button
            // biome-ignore lint/suspicious/noArrayIndexKey: card positions are stable within a game round
            key={`${card}-${i}`}
            type="button"
            onClick={() => handleClick(i)}
            className="aspect-square bg-card border-2 border-border hover:bg-accent text-4xl rounded-lg transition-all"
          >
            {flipped.includes(i) || matched.includes(i) ? card : "?"}
          </button>
        ))}
      </div>
      <div className="text-center">
        <Button onClick={resetGame}>Reset Game</Button>
      </div>
      {matched.length === cards.length && (
        <p className="text-center text-lg font-bold text-primary">
          🎉 You won in {moves} moves!
        </p>
      )}
    </div>
  );
}
