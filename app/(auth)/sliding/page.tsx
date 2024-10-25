"use client";
import { Button } from "@nextui-org/button";
import React, { useState, useEffect } from "react";

type Tile = number | null;

const generatePuzzle = (size: number): Tile[] => {
  const puzzle = Array.from({ length: size * size }, (_, i) => (i === 0 ? null : i));
  return shuffle(puzzle);
};

const solvedPuzzle = (size: number): Tile[] => {
  return Array.from({ length: size * size }, (_, i) => (i === 0 ? null : i));
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
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const clickSound = new Audio("/sounds/sound-click.mp3");

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | undefined;
    if (isTimerActive && !isGameWon) {
      timerInterval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    } else if (isGameWon) {
      clearInterval(timerInterval);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isTimerActive, isGameWon]);
  useEffect(() => {
    setIsGameWon(isSolved(puzzle, size));
  }, [puzzle]);

  const handleTileClick = (index: number) => {
    clickSound.play()
    clickSound.volume = 0.2
    if (!isTimerActive) setIsTimerActive(true);

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

  const handleShuffle = () => {
    setPuzzle(generatePuzzle(size));
    setIsGameWon(false);
    setTimer(0);
    setIsTimerActive(false);
  };

  const handleReset = () => {
    setPuzzle(solvedPuzzle(size));
    setIsGameWon(true);
    setIsTimerActive(false);
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <h1 className="text-2xl font-bold mb-4 text-secondary-600">Sliding Puzzle</h1>
      <p className="text-lg mb-2">Time: {timer} seconds</p>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
        {puzzle.map((tile, index) => (
          <Button
            size="lg"
            key={index}
            onClick={() => handleTileClick(index)}
            className={`w-20 h-20 flex items-center justify-center text-2xl font-bold border ${
              tile ? "bg-secondary-200 text-white" : "bg-gray-200"
            }`}
          >
            {tile !== null ? tile : ""}
          </Button>
        ))}
      </div>
      <div className="flex space-x-4 mt-4 w-full">
        <Button onClick={handleShuffle} fullWidth>
          Shuffle
        </Button>
        <Button onClick={handleReset} fullWidth>
          Reset Game
        </Button>
      </div>
      {isGameWon && <p className="text-green-500 mt-4">Congratulations! You solved the puzzle in {timer} seconds!</p>}
    </div>
  );
};

export default SlidingPuzzle;
