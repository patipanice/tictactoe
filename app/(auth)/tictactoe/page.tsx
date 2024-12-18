"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { isMobile } from "react-device-detect";
import Confetti from "react-confetti";
import { Button } from "@nextui-org/button";
import ModalBoardSetting, { colors } from "@/components/modal-board-setting";
import useWindowSize from "@/hooks/useWindowSize";
import { useAuthContext } from "@/contexts/auth-context";
import { MarkSymbol } from "@/enums/game.enum";
import useUserScore from "@/hooks/useUserScore";
import {
  HeartIcon,
  BinIcon,
  CameraIcon,
  MailIcon,
} from "@/components/icons/index";
import { RestartIcon } from "@/components/icons/RestartIcon";
import BackgroundMusic from "@/components/background-music";
import { SkullIcon } from "@/components/icons/SkullIcon";

enum PlayerMark {
  X = "X",
  O = "O",
}

enum BotLevel {
  easy = "easy",
  normal = "normal",
  hard = "hard",
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

const TicTacToe: React.FC = () => {
  const { user, score, playerWinStack, onChangeScore, onChangePlayerWinStack } =
    useAuthContext();
  const { fetchScore, updateScore } = useUserScore(
    user?.uid,
    user?.email || "",
    0
  );
  const { width, height } = useWindowSize(); // Get window size for confetti
  const [board, setBoard] = useState<Board>(initialBoard);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true); // Player starts as 'X'
  const [gameOver, setGameOver] = useState<boolean>(false); // To track game state
  const [winningLine, setWinningLine] = useState<WinningLine>([]); // Track winning line
  const [boardInterface, setBoardInterface] =
    useState<BoardInterface>(initialInterface);
  const [openSettingModal, setOpenSettingModal] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState(false); // Control confetti display
  const [botLevel, setBotLevel] = useState<BotLevel>(BotLevel.normal);

  const clickSound = useRef<HTMLAudioElement>(
    new Audio("/sounds/sound-click.mp3")
  );
  const gameBonusSound = useRef<HTMLAudioElement>(
    new Audio("/sounds/sound-game-bonus.mp3")
  );

  useEffect(() => {
    clickSound.current.preload = "auto";
    gameBonusSound.current.preload = "auto";
  }, []);

  const playClickSound = () => clickSound.current.play();
  const playBonusSound = () => gameBonusSound.current.play();

  useEffect(() => {
    fetchScore().then((res) => {
      if (res) {
        onChangeScore(res.score);
        onChangePlayerWinStack(res.winStack);
      } else {
        onChangeScore(0);
      }
    });
  }, []);

  //manage bot moves
  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      const newBoard = [...board];
      setTimeout(() => {
        botPlay(newBoard); // Bot makes its move
      }, 500);
    }
  }, [isPlayerTurn, gameOver]);

  // Function to determine if there is a winner
  const checkWinner = useCallback((squares: Board): Player => {
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

  const botPlay = (squares: Board): void => {
    if (botLevel === BotLevel.normal) {
      // Normal: Random available square
      const availableMoves = squares
        .map((val, index) => (val === null ? index : null))
        .filter((val) => val !== null) as number[];
      const randomMove =
        availableMoves[Math.floor(Math.random() * availableMoves.length)];
      squares[randomMove] = PlayerMark.O;
    } else {
      // Hard: Winning/blocking logic
      const findWinningMove = (player: PlayerMark): number | null => {
        for (const [a, b, c] of winPatterns) {
          if (
            squares[a] === player &&
            squares[a] === squares[b] &&
            squares[c] === null
          )
            return c;
          if (
            squares[a] === player &&
            squares[a] === squares[c] &&
            squares[b] === null
          )
            return b;
          if (
            squares[b] === player &&
            squares[b] === squares[c] &&
            squares[a] === null
          )
            return a;
        }
        return null;
      };

      // Try to win or block
      let move = findWinningMove(PlayerMark.O) || findWinningMove(PlayerMark.X);
      if (move === null) {
        const availableMoves = squares
          .map((val, index) => (val === null ? index : null))
          .filter((val) => val !== null) as number[];
        move =
          availableMoves[Math.floor(Math.random() * availableMoves.length)];
      }
      squares[move] = PlayerMark.O;
    }

    setBoard(squares);
    evaluateGameState(squares, PlayerMark.O);
  };

  const handlePlayerMove = (index: number): void => {
    if (board[index] || gameOver) return; // Ignore if the square is occupied or the game is over
    playClickSound();

    const newBoard = [...board];
    newBoard[index] = PlayerMark.X; // Player's move as 'X'

    setBoard(newBoard);
    evaluateGameState(newBoard, PlayerMark.X); // Evaluate the state after the player's move
  };

  const handleWin = (winner: Player): void => {
    setGameOver(true);

    let _score = 0;
    let _playerWinStack = 0;
    if (winner === PlayerMark.X) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);

      _score = score + 1;
      _playerWinStack = playerWinStack + 1;

      if (playerWinStack === maxWinStack) {
        _score = botLevel === BotLevel.normal ? score + 1 : score + 2;
        _playerWinStack = 0;
        playBonusSound();
      }
    } else {
      //? bot winner
      _score = score === 0 ? 0 : score + -1;
      _playerWinStack = 0;
    }
    onChangeScore(_score);
    onChangePlayerWinStack(_playerWinStack);
    updateScore(_score, _playerWinStack); // firebase store update
  };

  const evaluateGameState = useCallback(
    (newBoard: Board, currentPlayer: Player) => {
      const winner = checkWinner(newBoard);
      if (winner) {
        handleWin(winner); // Handle win if a winner is found
      } else if (newBoard.every((square) => square !== null)) {
        setGameOver(true); // Set game over if it's a draw
      } else {
        setIsPlayerTurn(currentPlayer === PlayerMark.O); // Toggle turn
      }
    },
    [checkWinner, handleWin]
  );

  const resetGame = (): void => {
    playClickSound();
    setBoard(initialBoard);
    setIsPlayerTurn(true);
    setGameOver(false);
    setWinningLine([]);
  };

  return (
    <>
      <section className="max-w-lg mx-auto text-center">
        <div className="my-3">
          <h2 className="text-3xl lg:text-4xl font-bold text-secondary-600">
            Tic Tac Toe
          </h2>
          <p className="text-sm text-gray-600 dark:text-white">Player vs Bot</p>
        </div>
        <div className={`grid grid-cols-3 mx-3 md:px-10`}>
          {board.map((value, index) => (
            <Button
              className={"h-[100px] md:h-[110px] border border-white"}
              radius="none"
              size="lg"
              style={{
                backgroundColor: boardInterface.board.backgroundColor,
              }}
              key={index}
              onClick={() => handlePlayerMove(index)}
              isDisabled={!isPlayerTurn}
            >
              <span
                className={
                  winningLine.includes(index)
                    ? "text-red-600 font-extrabold text-2xl winner-effect"
                    : "text-neutral-900 text-2xl"
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
          <p className="text-xl text-secondary-500">
            Your score:{" "}
            <span className={`font-semibold text-secondary-500`}>{score}</span>
          </p>
          <p className="text-gray-600 dark:text-white text-sm">
            Streak: {playerWinStack} (Get bonus points by winning 3 times!)
          </p>
        </div>
        <div className="flex flex-row gap-2 w-full">
          <Button
            startContent={
              botLevel === BotLevel.normal ? <HeartIcon /> : <SkullIcon />
            }
            isIconOnly
            color={botLevel === BotLevel.hard ? "danger" : "default"}
            onClick={() =>
              setBotLevel((prev) => {
                if (prev === BotLevel.normal) {
                  return BotLevel.hard;
                } else {
                  return BotLevel.normal;
                }
              })
            }
          />
          <BackgroundMusic />
          <Button
            onClick={() => setOpenSettingModal(true)}
            variant="flat"
            color="default"
            fullWidth
          >
            Setting Interface
          </Button>
          <Button
            onClick={resetGame}
            color="secondary"
            isDisabled={!gameOver}
            fullWidth
            startContent={<RestartIcon />}
          >
            Start New Game
          </Button>
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
          numberOfPieces={isMobile ? 50 : 200} // Reduce confetti count on mobile
          gravity={isMobile ? 0.1 : 0.4} // Lower gravity for mobile
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
  } else if (symbol == MarkSymbol.mail) {
    return <MailIcon />;
  } else {
    return isPlayer ? <p>X</p> : <p>O</p>;
  }
};
