"use client";
import { Button } from "@nextui-org/button";
import { useState, useEffect, useCallback } from "react";
import { HeartIcon } from "@/components/icons/HeartIcon";
import { CameraIcon } from "@/components/icons/CameraIcon";
import { BinIcon } from "@/components/icons/BinIcon";
import ModalBoardSetting, { colors } from "@/components/modal-board-setting";

import Confetti from "react-confetti";
import useWindowSize from "@/hooks/useWindowSize";
import { TrophyIcon } from "@/components/icons/TrophyIcon";
import { MailIcon } from "@/components/icons/MailIcon";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { collectionName, db } from "@/config/firebase";
import { useAuthContext } from "@/contexts/auth-context";
import { MarkSymbol } from "@/enums/game.enum";

enum PlayerMark {
  X = "X",
  O = "O",
}

type Player = PlayerMark.X | PlayerMark.O | null;
type Board = Player[];
type WinningLine = number[];

export interface BoardInterface {
  symbol: {
    player: MarkSymbol;
    bot: MarkSymbol;
  };
  board: {
    backgroundColor: string;
  };
}

const initialBoard: Board = Array(9).fill(null);
const maxWinStack = 2;
const initialInterface: BoardInterface = {
  symbol: {
    player: MarkSymbol.default,
    bot: MarkSymbol.default,
  },
  board: {
    backgroundColor: colors[2],
  },
};

const TicTacToe: React.FC = () => {
  const { user, score,playerWinStack, onChangeScore, onChangePlayerWinStack } = useAuthContext()
  const [board, setBoard] = useState<Board>(initialBoard); // 3x3 board
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true); // Player starts as 'X'
  const [gameOver, setGameOver] = useState<boolean>(false); // To track game state
  const [winningLine, setWinningLine] = useState<WinningLine>([]); // Track winning line
  const [boardInterface, setBoardInterface] = useState<BoardInterface>(initialInterface);
  const [openSettingModal, setOpenSettingModal] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState(false); // Control confetti display
  const { width, height } = useWindowSize(); // Get window size for confetti

  const clickSound = new Audio("/sounds/sound-click.mp3");
  const gameBonusSound = new Audio("/sounds/sound-game-bonus.mp3");

  useEffect(() => {
    const fetchUserScore = async (userId: string) => {
      const userDocRef = doc(db, collectionName.users, userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        onChangeScore(userDoc.data()?.score || 0)
        onChangePlayerWinStack(userDoc.data()?.winStack || 0)
      } else {
        // If user does not exist, create a new entry with a score of 0
        await setDoc(userDocRef, { score: 0, winStack: 0 });
        onChangeScore(0)
      }
    };
    fetchUserScore(user?.uid as string)
  }, [user])

  // Function to determine if there is a winner
  const checkWinner = useCallback((squares: Board): Player => {
    const winPatterns: WinningLine[] = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winPatterns.length; i++) {
      const [a, b, c] = winPatterns[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        setWinningLine(winPatterns[i]); // Store the winning line indexes
        return squares[a]; // Return 'X' or 'O' as winner
      }
    }
    return null;
  }, []);

  // Bot's move logic
  const botPlay = (squares: Board): void => {
    const availableMoves = squares
      .map((val, index) => (val === null ? index : null))
      .filter((val) => val !== null);
    if (availableMoves.length > 0) {
      const randomMove = availableMoves[
        Math.floor(Math.random() * availableMoves.length)
      ] as number;
      squares[randomMove] = PlayerMark.O;
      setBoard(squares);
      setIsPlayerTurn(true); // Switch back to player
    }
  };

  // Handle player’s move
  const handlePlayerMove = (index: number): void => {
    if (board[index] || gameOver) return; // Ignore if the square is occupied or the game is over
    clickSound.play();
    const newBoard = [...board];
    newBoard[index] = PlayerMark.X; // Player's move as 'X'
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      handleWin(winner);
    } else {
      setIsPlayerTurn(false); // Bot's turn after player move
    }
  };

  // Handle winning logic
  const handleWin = (winner: Player): void => {
    setGameOver(true);

    if (winner === PlayerMark.X) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      let _score = score + 1;
      let _playerWinStack = playerWinStack + 1;
      if (playerWinStack === maxWinStack) {
        _score = score + 3;
        gameBonusSound.play();
        _playerWinStack = 0
        onChangePlayerWinStack(_playerWinStack);
        updateUserScore(String(user?.uid), _score, _playerWinStack);
      } else {
        onChangePlayerWinStack(_playerWinStack);
        updateUserScore(String(user?.uid), _score, _playerWinStack);
      }
      onChangeScore(_score);
    }
  };

  const resetGame = (): void => {
    clickSound.play();
    setBoard(initialBoard);
    setIsPlayerTurn(true);
    setGameOver(false);
    setWinningLine([]);
  };

  // Handle bot’s turn in a separate effect
  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      const newBoard = [...board];
      setTimeout(() => {
        botPlay(newBoard); // Bot takes a move
        const winner = checkWinner(newBoard);
        if (winner) {
          setGameOver(true);
          let _score = score - 1;
          if (score === 0) {
            _score = 0
          }
          updateUserScore(String(user?.uid), _score, 0);
          onChangeScore(_score); // Deduct score for bot win
          onChangePlayerWinStack(0); // Reset player win stack on bot win
        }
      }, 500);
    }
  }, [isPlayerTurn, gameOver]);

  const updateUserScore = async (userId: string, newScore: number, playerWinStack: number) => {
    const userDocRef = doc(db, collectionName.users, userId);
    await updateDoc(userDocRef, { score: newScore, winStack: playerWinStack });
  };

  const isDraw = board.every((square) => square !== null);

  return (
    <>
      <section className="max-w-lg mx-auto text-center">
        <div className="my-3">
          <h2 className="text-3xl font-bold text-primary-600">Tic Tac Toe</h2>
          <p className="text-sm text-gray-600">Player vs Bot</p>
        </div>
        <div className="grid grid-cols-3 mx-5">
          {board.map((value, index) => (
            <Button
              className="h-[100px] md:h-[140px] border border-white"
              radius="none"
              size="lg"
              style={{
                backgroundColor: boardInterface.board.backgroundColor
              }}
              key={index}
              onClick={() => handlePlayerMove(index)}
              isDisabled={!isPlayerTurn}
            >
              <span
                className={
                  winningLine.includes(index)
                    ? "text-red-500 font-bold text-2xl"
                    : "text-black-600 text-2xl"
                }
              >
                {value && (
                  <SymbolDisplay
                    isPlayer={value === PlayerMark.X}
                    symbol={
                      value === PlayerMark.X
                        ? boardInterface.symbol.player
                        : boardInterface.symbol.bot
                    }
                  />
                )}
              </span>
            </Button>
          ))}
        </div>
        <div className="py-4">
          <p className="text-xl text-primary-500">Your score: {score}</p>
          <p className="text-gray-600 text-sm">
            Win stack: {playerWinStack} (win 3 times get bonus points!)
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => setOpenSettingModal(true)}
            variant="flat"
            color="default"
          >
            Setting Interface
          </Button>
          {(gameOver || isDraw) && (
            <Button onClick={resetGame} color="primary">
              Start New Game
            </Button>
          )}
        </div>
      </section>
      <ModalBoardSetting
        isOpen={openSettingModal}
        boardInterface={boardInterface}
        onOpenChange={setOpenSettingModal}
        setBoardInterface={setBoardInterface}
      />
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={200}
          gravity={0.4}
          colors={["#FFD700", "#FF4500", "#1E90FF"]}
        />
      )}
    </>
  );
};

export default TicTacToe;

const SymbolDisplay = ({
  symbol,
  isPlayer = false,
}: {
  symbol: MarkSymbol;
  isPlayer?: boolean;
}) => {
  if (symbol == MarkSymbol.heart) {
    return <HeartIcon />;
  } else if (symbol == MarkSymbol.camera) {
    return <CameraIcon />;
  } else if (symbol == MarkSymbol.bin) {
    return <BinIcon />;
  } else if (symbol === MarkSymbol.trophy) {
    return <TrophyIcon />
  } else if (symbol === MarkSymbol.mail) {
    return <MailIcon />
  } else {
    return isPlayer ? <p>X</p> : <p>O</p>;
  }
};
