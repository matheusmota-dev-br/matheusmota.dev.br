'use client';

import { useState, useEffect } from 'react';
import { GameModal } from './GameModal';
import SnakeGame from './snake';
import TetrisGame from './tetris';

const gameInfo: Record<string, { name: string; description: string; component: React.ComponentType }> = {
  snake: {
    name: "Snake",
    description: "The classic snake game. Use the arrows or WASD to move and eat the food to grow!",
    component: SnakeGame,
  },
  tetris: {
    name: "Tetris",
    description: "The famous block puzzle game. Arrange the pieces to form complete lines!",
    component: TetrisGame,
  },
};

export function GameModalManager() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  useEffect(() => {
    const handleOpenGame = (event: CustomEvent<string>) => {
      const gameId = event.detail;
      if (gameInfo[gameId]) {
        setSelectedGame(gameId);
      }
    };

    window.addEventListener('openGame' as any, handleOpenGame as EventListener);

    return () => {
      window.removeEventListener('openGame' as any, handleOpenGame as EventListener);
    };
  }, []);

  const handleCloseGame = () => {
    setSelectedGame(null);
  };

  const currentGame = selectedGame ? gameInfo[selectedGame] : null;
  const GameComponent = currentGame?.component;

  if (!currentGame || !GameComponent) return null;

  return (
    <GameModal
      isOpen={selectedGame !== null}
      onClose={handleCloseGame}
      title={currentGame.name}
    >
      <GameComponent />
    </GameModal>
  );
}
