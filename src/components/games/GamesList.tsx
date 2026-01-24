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

interface GamesListProps {
  games: string[];
}

export function GamesList({ games }: GamesListProps) {
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

  const handleOpenGame = (gameId: string) => {
    setSelectedGame(gameId);
  };

  const handleCloseGame = () => {
    setSelectedGame(null);
  };

  const currentGame = selectedGame ? gameInfo[selectedGame] : null;
  const GameComponent = currentGame?.component;

  return (
    <>
      <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 md:grid-cols-2 xl:grid-cols-3 max-w-6xl mx-auto">
        {games.map((gameId) => {
          const game = gameInfo[gameId];
          if (!game) return null;

          return (
            <button
              key={gameId}
              onClick={() => handleOpenGame(gameId)}
              className="group relative block bg-offset rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl text-left w-full"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-xl font-semibold text-default group-hover:text-primary transition-colors">
                    {game.name}
                  </h3>
                </div>
                <p className="text-text-offset text-sm leading-relaxed">
                  {game.description}
                </p>
                <div className="mt-4 flex items-center text-primary text-sm font-medium">
                  Play now
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {games.length === 0 && (
        <div className="text-center mt-12">
          <p className="text-text-offset">No games available at the moment.</p>
        </div>
      )}

      {currentGame && GameComponent && (
        <GameModal
          isOpen={selectedGame !== null}
          onClose={handleCloseGame}
          title={currentGame.name}
        >
          <GameComponent />
        </GameModal>
      )}
    </>
  );
}
