'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import './tetris.css';

type Position = { x: number; y: number };
type Cell = number | null;
type Board = Cell[][];

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const VISIBLE_ROWS = 15; // Show only 15 rows instead of 20
const CELL_SIZE = 25;

// Tetromino shapes (I, O, T, S, Z, J, L)
const TETROMINOES = {
  I: [
    [[1, 1, 1, 1]],
    [[1], [1], [1], [1]],
  ],
  O: [
    [[1, 1], [1, 1]],
  ],
  T: [
    [[0, 1, 0], [1, 1, 1]],
    [[1, 0], [1, 1], [1, 0]],
    [[1, 1, 1], [0, 1, 0]],
    [[0, 1], [1, 1], [0, 1]],
  ],
  S: [
    [[0, 1, 1], [1, 1, 0]],
    [[1, 0], [1, 1], [0, 1]],
  ],
  Z: [
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1], [1, 1], [1, 0]],
  ],
  J: [
    [[1, 0, 0], [1, 1, 1]],
    [[1, 1], [1, 0], [1, 0]],
    [[1, 1, 1], [0, 0, 1]],
    [[0, 1], [0, 1], [1, 1]],
  ],
  L: [
    [[0, 0, 1], [1, 1, 1]],
    [[1, 0], [1, 0], [1, 1]],
    [[1, 1, 1], [1, 0, 0]],
    [[1, 1], [0, 1], [0, 1]],
  ],
};

type TetrominoType = keyof typeof TETROMINOES;

const COLORS: Record<TetrominoType, string> = {
  I: 'var(--color-primary)',
  O: 'var(--color-warning)',
  T: 'var(--color-secondary)',
  S: 'var(--color-success)',
  Z: 'var(--color-error)',
  J: '#8B5CF6',
  L: '#F59E0B',
};

interface Tetromino {
  type: TetrominoType;
  shape: number[][];
  position: Position;
  rotation: number;
}

const INITIAL_DROP_TIME = 1000;
const SPEED_INCREASE = 50;

export default function TetrisGame() {
  const [board, setBoard] = useState<Board>(() => createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null);
  const [nextPiece, setNextPiece] = useState<Tetromino | null>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dropTime, setDropTime] = useState(INITIAL_DROP_TIME);
  const dropTimeRef = useRef(INITIAL_DROP_TIME);
  const gameLoopRef = useRef<number | null>(null);

  function createEmptyBoard(): Board {
    return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
  }

  const createRandomPiece = useCallback((): Tetromino => {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    const type = types[Math.floor(Math.random() * types.length)];
    const shapes = TETROMINOES[type];
    return {
      type,
      shape: shapes[0],
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
      rotation: 0,
    };
  }, []);

  const isValidPosition = useCallback((piece: Tetromino, board: Board, deltaX = 0, deltaY = 0): boolean => {
    const { shape, position } = piece;
    const newX = position.x + deltaX;
    const newY = position.y + deltaY;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardX = newX + x;
          const boardY = newY + y;

          if (
            boardX < 0 ||
            boardX >= BOARD_WIDTH ||
            boardY >= BOARD_HEIGHT ||
            (boardY >= 0 && board[boardY][boardX] !== null)
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }, []);

  const rotatePiece = useCallback((piece: Tetromino): Tetromino => {
    const shapes = TETROMINOES[piece.type];
    const nextRotation = (piece.rotation + 1) % shapes.length;
    const rotatedShape = shapes[nextRotation];

    return {
      ...piece,
      shape: rotatedShape,
      rotation: nextRotation,
    };
  }, []);

  const placePiece = useCallback((piece: Tetromino, board: Board): Board => {
    const newBoard = board.map(row => [...row]);
    const { shape, position, type } = piece;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = type as any;
          }
        }
      }
    }
    return newBoard;
  }, []);

  const clearLines = useCallback((board: Board): { newBoard: Board; linesCleared: number } => {
    const newBoard = board.filter(row => row.some(cell => cell === null));
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null));
    }

    return { newBoard, linesCleared };
  }, []);

  const dropPiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;

    setCurrentPiece(prev => {
      if (!prev) return null;

      if (isValidPosition(prev, board, 0, 1)) {
        return { ...prev, position: { ...prev.position, y: prev.position.y + 1 } };
      } else {
        const newBoard = placePiece(prev, board);
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
        setBoard(clearedBoard);

        if (linesCleared > 0) {
          setLines(prev => {
            const newLines = prev + linesCleared;
            const newLevel = Math.floor(newLines / 10) + 1;
            if (newLevel > level) {
              setLevel(newLevel);
              const newDropTime = Math.max(INITIAL_DROP_TIME - (newLevel - 1) * SPEED_INCREASE, 100);
              setDropTime(newDropTime);
              dropTimeRef.current = newDropTime;
            }
            return newLines;
          });
          setScore(prev => prev + linesCleared * 100 * level);
        }

        const next = nextPiece || createRandomPiece();
        setNextPiece(createRandomPiece());

        if (!isValidPosition(next, clearedBoard)) {
          setGameOver(true);
          return null;
        }

        return next;
      }
    });
  }, [currentPiece, board, gameOver, isPaused, nextPiece, level, isValidPosition, placePiece, clearLines, createRandomPiece]);

  useEffect(() => {
    if (!currentPiece && !gameOver) {
      const piece = createRandomPiece();
      setCurrentPiece(piece);
      setNextPiece(createRandomPiece());
    }
  }, [currentPiece, gameOver, createRandomPiece]);

  useEffect(() => {
    if (gameOver || isPaused || !currentPiece) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    gameLoopRef.current = window.setInterval(() => {
      dropPiece();
    }, dropTimeRef.current);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [dropPiece, gameOver, isPaused, currentPiece]);

  useEffect(() => {
    dropTimeRef.current = dropTime;
  }, [dropTime]);

  const movePiece = useCallback((deltaX: number) => {
    if (gameOver || isPaused || !currentPiece) return;

    setCurrentPiece(prev => {
      if (!prev) return null;
      if (isValidPosition(prev, board, deltaX, 0)) {
        return { ...prev, position: { x: prev.position.x + deltaX, y: prev.position.y } };
      }
      return prev;
    });
  }, [gameOver, isPaused, currentPiece, board, isValidPosition]);

  const rotateCurrentPiece = useCallback(() => {
    if (gameOver || isPaused || !currentPiece) return;

    setCurrentPiece(prev => {
      if (!prev) return null;
      const rotated = rotatePiece(prev);
      if (isValidPosition(rotated, board)) {
        return rotated;
      }
      return prev;
    });
  }, [gameOver, isPaused, currentPiece, board, rotatePiece, isValidPosition]);

  const hardDrop = useCallback(() => {
    if (gameOver || isPaused || !currentPiece) return;

    setCurrentPiece(prev => {
      if (!prev) return null;
      let newPiece = { ...prev };
      let dropDistance = 0;
      while (isValidPosition(newPiece, board, 0, 1)) {
        newPiece = { ...newPiece, position: { ...newPiece.position, y: newPiece.position.y + 1 } };
        dropDistance++;
      }
      
      // Place the piece immediately
      if (dropDistance > 0) {
        const newBoard = placePiece(newPiece, board);
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
        setBoard(clearedBoard);

        if (linesCleared > 0) {
          setLines(prev => {
            const newLines = prev + linesCleared;
            const newLevel = Math.floor(newLines / 10) + 1;
            if (newLevel > level) {
              setLevel(newLevel);
              const newDropTime = Math.max(INITIAL_DROP_TIME - (newLevel - 1) * SPEED_INCREASE, 100);
              setDropTime(newDropTime);
              dropTimeRef.current = newDropTime;
            }
            return newLines;
          });
          setScore(prev => prev + linesCleared * 100 * level);
        }

        const next = nextPiece || createRandomPiece();
        setNextPiece(createRandomPiece());

        if (!isValidPosition(next, clearedBoard)) {
          setGameOver(true);
          return null;
        }

        return next;
      }
      
      return newPiece;
    });
  }, [gameOver, isPaused, currentPiece, board, isValidPosition, placePiece, clearLines, level, nextPiece, createRandomPiece]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === ' ' || e.key === 'Enter') {
          setBoard(createEmptyBoard());
          setCurrentPiece(null);
          setNextPiece(null);
          setScore(0);
          setLines(0);
          setLevel(1);
          setGameOver(false);
          setIsPaused(false);
          setDropTime(INITIAL_DROP_TIME);
          dropTimeRef.current = INITIAL_DROP_TIME;
        }
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePiece(-1);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePiece(1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          dropPiece();
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          rotateCurrentPiece();
          break;
        case ' ':
          e.preventDefault();
          if (e.shiftKey) {
            hardDrop();
          } else {
            setIsPaused(prev => !prev);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver, movePiece, dropPiece, rotateCurrentPiece, hardDrop]);

  const renderBoard = () => {
    const displayBoard = currentPiece ? placePiece(currentPiece, board) : board;
    const cells = [];
    const startRow = Math.max(0, BOARD_HEIGHT - VISIBLE_ROWS);

    for (let y = startRow; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const cell = displayBoard[y][x];
        const cellClass = cell ? `tetris-cell tetris-cell-${cell}` : 'tetris-cell';
        const cellStyle = cell ? { backgroundColor: COLORS[cell as unknown as TetrominoType] } : {};

        cells.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
            style={{
              gridColumn: x + 1,
              gridRow: y - startRow + 1,
              ...cellStyle,
            }}
          />
        );
      }
    }
    return cells;
  };

  const renderNextPiece = () => {
    if (!nextPiece) return null;

    const cells = [];
    const shape = nextPiece.shape;
    const shapeWidth = shape[0]?.length || 0;
    const shapeHeight = shape.length;
    
    // Center the piece in a 4x4 grid
    const offsetX = Math.floor((4 - shapeWidth) / 2);
    const offsetY = Math.floor((4 - shapeHeight) / 2);

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          cells.push(
            <div
              key={`next-${x}-${y}`}
              className="tetris-next-cell"
              style={{
                gridColumn: x + offsetX + 1,
                gridRow: y + offsetY + 1,
                backgroundColor: COLORS[nextPiece.type],
              }}
            />
          );
        }
      }
    }
    return cells;
  };

  return (
    <div className="tetris-game flex flex-col items-center gap-4 p-4 relative w-full">
      <div className="tetris-game-container flex flex-col items-center gap-4">
        <div className="tetris-game-header flex justify-between items-center w-full max-w-2xl">
          <div className="tetris-stats">
            <div className="text-lg font-bold text-default">Score: {score}</div>
            <div className="text-sm text-text-offset">Lines: {lines}</div>
            <div className="text-sm text-text-offset">Level: {level}</div>
          </div>
          {isPaused && !gameOver && (
            <div className="tetris-paused text-base font-bold" style={{ color: 'var(--color-warning)' }}>
              PAUSED
            </div>
          )}
        </div>

        <div className="tetris-main flex gap-6 items-start">
          <div className="tetris-board-wrapper flex flex-col gap-4">
            <div
              className="tetris-board"
              style={{
                gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
                gridTemplateRows: `repeat(${VISIBLE_ROWS}, ${CELL_SIZE}px)`,
                overflow: 'hidden',
              }}
            >
              {renderBoard()}
            </div>
          </div>

          <div className="tetris-sidebar flex flex-col gap-6 items-start">
            <div className="flex flex-col items-center">
              <div className="text-sm font-semibold text-default mb-2">Next:</div>
              <div
                className="tetris-next"
                style={{
                  gridTemplateColumns: `repeat(4, ${CELL_SIZE * 0.8}px)`,
                  gridTemplateRows: `repeat(4, ${CELL_SIZE * 0.8}px)`,
                }}
              >
                {renderNextPiece()}
              </div>
            </div>

            {!gameOver && (
              <div className="tetris-game-controls flex flex-col text-sm text-offset min-w-[200px]">
                <div className="text-base font-semibold text-default mb-2">Controls:</div>
                <p className="my-1">← → or A/D to move</p>
                <p className="my-1">↑ or W to rotate</p>
                <p className="my-1">↓ or S to drop faster</p>
                <p className="my-1">Shift + Space for hard drop</p>
                <p className="my-1">Space to pause</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {gameOver && (
        <div className="tetris-game-overlay absolute inset-0 flex items-center justify-center z-50 rounded-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          <div className="tetris-game-overlay-content bg-default p-8 rounded-lg text-center border-2" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-error)' }}>
              Game Over!
            </h2>
            <p className="text-default mb-2">Final score: {score}</p>
            <p className="text-default mb-2">Lines cleared: {lines}</p>
            <p className="text-default mb-2">Level reached: {level}</p>
            <p className="tetris-game-instructions mt-4 text-sm text-offset">
              Press SPACE or ENTER to play again
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
