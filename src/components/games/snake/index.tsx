'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import './snake.css';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION: Direction = 'RIGHT';
const GAME_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      snake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );
    return newFood;
  }, [snake]);

  const checkCollision = useCallback(
    (head: Position, body: Position[]): boolean => {
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
      ) {
        return true;
      }

      return body.some(
        (segment, index) =>
          index > 0 && segment.x === head.x && segment.y === head.y
      );
    },
    []
  );

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };
      const currentDirection = directionRef.current;

      switch (currentDirection) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      if (checkCollision(head, prevSnake)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => prev + 1);
        setFood(generateFood());
        return newSnake;
      }

      newSnake.pop();
      return newSnake;
    });
  }, [food, gameOver, isPaused, checkCollision, generateFood]);

  useEffect(() => {
    if (gameOver || isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    gameLoopRef.current = window.setInterval(() => {
      moveSnake();
    }, GAME_SPEED);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [moveSnake, gameOver, isPaused]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === ' ' || e.key === 'Enter') {
          setSnake(INITIAL_SNAKE);
          setFood({ x: 15, y: 15 });
          setDirection(INITIAL_DIRECTION);
          directionRef.current = INITIAL_DIRECTION;
          setGameOver(false);
          setScore(0);
          setIsPaused(false);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current !== 'DOWN') {
            setDirection('UP');
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current !== 'UP') {
            setDirection('DOWN');
          }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current !== 'RIGHT') {
            setDirection('LEFT');
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current !== 'LEFT') {
            setDirection('RIGHT');
          }
          break;
        case ' ':
          e.preventDefault();
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver, direction]);

  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnake = snake.some(
          (segment) => segment.x === x && segment.y === y
        );
        const isHead = snake[0]?.x === x && snake[0]?.y === y;
        const isFood = food.x === x && food.y === y;

        let cellClass = 'snake-cell';
        if (isHead) {
          cellClass += ' snake-cell-head';
        } else if (isSnake) {
          cellClass += ' snake-cell-body';
        } else if (isFood) {
          cellClass += ' snake-cell-food';
        }

        grid.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
            style={{
              gridColumn: x + 1,
              gridRow: y + 1,
            }}
          />
        );
      }
    }
    return grid;
  };

  return (
    <div className="snake-game flex flex-col items-center gap-4 p-4 relative w-full">
      <div className="snake-game-container flex flex-col items-center gap-4">
        <div className="snake-game-header flex justify-between items-center w-full" style={{ maxWidth: `${GRID_SIZE * CELL_SIZE}px` }}>
          <div className="snake-game-score text-xl font-bold text-default">
            Score: {score}
          </div>
          {isPaused && !gameOver && (
            <div className="snake-game-paused text-base font-bold" style={{ color: 'var(--color-warning)' }}>
              PAUSED
            </div>
          )}
        </div>

        <div className="snake-game-main flex gap-6 items-start">
          <div
            className="snake-game-board"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            }}
          >
            {renderGrid()}
          </div>

          {!gameOver && (
            <div className="snake-game-controls flex flex-col justify-center text-sm text-offset min-w-[200px]">
              <div className="text-base font-semibold text-default mb-2">Controls:</div>
              <p className="my-1">← → ↑ ↓ or WASD to move</p>
              <p className="my-1">Space to pause</p>
            </div>
          )}
        </div>
      </div>

      {gameOver && (
        <div className="snake-game-overlay absolute inset-0 flex items-center justify-center z-50 rounded-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          <div className="snake-game-overlay-content bg-default p-8 rounded-lg text-center border-2" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-error)' }}>
              Game Over!
            </h2>
            <p className="text-default mb-2">Final score: {score}</p>
            <p className="snake-game-instructions mt-4 text-sm text-offset">
              Press SPACE or ENTER to play again
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
