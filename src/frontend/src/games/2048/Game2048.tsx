import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Board = number[][];

const initBoard = (): Board => {
  const board = Array(4).fill(null).map(() => Array(4).fill(0));
  addRandomTile(board);
  addRandomTile(board);
  return board;
};

const addRandomTile = (board: Board) => {
  const empty: [number, number][] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) empty.push([i, j]);
    }
  }
  if (empty.length > 0) {
    const [i, j] = empty[Math.floor(Math.random() * empty.length)];
    board[i][j] = Math.random() < 0.9 ? 2 : 4;
  }
};

export default function Game2048() {
  const [board, setBoard] = useState<Board>(initBoard());
  const [score, setScore] = useState(0);

  const move = (direction: 'up' | 'down' | 'left' | 'right') => {
    const newBoard = board.map(row => [...row]);
    let moved = false;
    let points = 0;

    const slide = (arr: number[]): number[] => {
      const filtered = arr.filter(x => x !== 0);
      const result: number[] = [];
      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          result.push(filtered[i] * 2);
          points += filtered[i] * 2;
          i++;
        } else {
          result.push(filtered[i]);
        }
      }
      while (result.length < 4) result.push(0);
      return result;
    };

    if (direction === 'left') {
      for (let i = 0; i < 4; i++) {
        const newRow = slide(newBoard[i]);
        if (JSON.stringify(newRow) !== JSON.stringify(newBoard[i])) moved = true;
        newBoard[i] = newRow;
      }
    } else if (direction === 'right') {
      for (let i = 0; i < 4; i++) {
        const newRow = slide(newBoard[i].reverse()).reverse();
        if (JSON.stringify(newRow) !== JSON.stringify(newBoard[i])) moved = true;
        newBoard[i] = newRow;
      }
    } else if (direction === 'up') {
      for (let j = 0; j < 4; j++) {
        const col = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]];
        const newCol = slide(col);
        if (JSON.stringify(newCol) !== JSON.stringify(col)) moved = true;
        for (let i = 0; i < 4; i++) newBoard[i][j] = newCol[i];
      }
    } else if (direction === 'down') {
      for (let j = 0; j < 4; j++) {
        const col = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]];
        const newCol = slide(col.reverse()).reverse();
        if (JSON.stringify(newCol) !== JSON.stringify(col)) moved = true;
        for (let i = 0; i < 4; i++) newBoard[i][j] = newCol[i];
      }
    }

    if (moved) {
      addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(score + points);
    }
  };

  const reset = () => {
    setBoard(initBoard());
    setScore(0);
  };

  return (
    <div className="space-y-4 py-4">
      <div className="text-center">
        <p className="text-lg font-semibold">Score: {score}</p>
        <p className="text-sm text-muted-foreground">Use buttons or arrow keys to play</p>
      </div>
      <div className="grid grid-cols-4 gap-2 max-w-md mx-auto bg-muted p-2 rounded-lg">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className="aspect-square bg-card border-2 border-border rounded-lg flex items-center justify-center text-2xl font-bold"
              style={{
                backgroundColor: cell ? `oklch(var(--primary) / ${Math.min(cell / 2048, 0.9)})` : undefined
              }}
            >
              {cell || ''}
            </div>
          ))
        )}
      </div>
      <div className="flex justify-center gap-2">
        <Button onClick={() => move('up')}>↑</Button>
        <Button onClick={() => move('down')}>↓</Button>
        <Button onClick={() => move('left')}>←</Button>
        <Button onClick={() => move('right')}>→</Button>
      </div>
      <div className="text-center">
        <Button onClick={reset} variant="outline">Reset</Button>
      </div>
    </div>
  );
}
