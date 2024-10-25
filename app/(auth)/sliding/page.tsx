"use client"
import { Button } from "@nextui-org/button";
import React, { useState, useEffect } from "react";

type Tile = number | null;

const generatePuzzle = (size: number): Tile[] => {
  const puzzle = Array.from({ length: size * size }, (_, i) => (i === 0 ? null : i));
  return shuffle(puzzle);
};

// Fisher-Yates shuffle algorithm to shuffle the puzzle
const shuffle = (array: Tile[]): Tile[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const isSolved = (puzzle: Tile[], size: number) => {
  for (let i = 1; i < size * size - 1; i++) {
    if (puzzle[i - 1] !== i) return false;
  }
  return puzzle[size * size - 1] === null;
};

const SlidingPuzzle: React.FC = () => {
  const size = 3;
  const [puzzle, setPuzzle] = useState<Tile[]>(generatePuzzle(size));
  const [isGameWon, setIsGameWon] = useState(false);

  useEffect(() => {
    setIsGameWon(isSolved(puzzle, size));
  }, [puzzle]);

  const handleTileClick = (index: number) => {
    const emptyIndex = puzzle.indexOf(null);
    const row = Math.floor(index / size);
    const col = index % size;
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;

    const isAdjacent = (row === emptyRow && Math.abs(col - emptyCol) === 1) || (col === emptyCol && Math.abs(row - emptyRow) === 1);

    if (isAdjacent) {
      const newPuzzle = [...puzzle];
      [newPuzzle[index], newPuzzle[emptyIndex]] = [newPuzzle[emptyIndex], newPuzzle[index]];
      setPuzzle(newPuzzle);
    }
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <h1 className="text-2xl font-bold mb-4 text-secondary-600">Sliding Puzzle</h1>
      <div className={`grid grid-cols-${size} gap-2`}>
        {puzzle.map((tile, index) => (
          <Button
          size="lg"
            key={index}
            onClick={() => handleTileClick(index)}
            className={`w-20 h-20 flex items-center justify-center text-2xl font-bold border ${
              tile ? "bg-secondary-300 text-white" : "bg-gray-200"
            }`}
          >
            {tile !== null ? tile : ""}
          </Button>
        ))}
      </div>
      {isGameWon && <p className="text-green-500 mt-4">Congratulations! You solved the puzzle!</p>}
    </div>
  );
};

export default SlidingPuzzle;
