'use client'

import React from 'react';

type GameOptionsProps = {
  boardSize: number;
  setBoardSize: (size: number) => void;
  gameMode: string;
  setGameMode: (mode: string) => void;
  currentPlayer: number;
  selectedLetter: string;
  setSelectedLetter: (letter: string) => void;
  gameStarted: boolean;
  startGame: () => void;
  resetGame: () => void;
}

const GameOptions = ({
  boardSize,
  setBoardSize,
  gameMode,
  setGameMode,
  currentPlayer,
  selectedLetter,
  setSelectedLetter,
  gameStarted,
  startGame,
  resetGame
}: GameOptionsProps) => {
  
  const handleBoardSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value);
    if (size >= 3 && size <= 12) {
      setBoardSize(size);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Board Size: {boardSize}x{boardSize}</label>
        <input
          type="range"
          min="3"
          max="12"
          value={boardSize}
          onChange={handleBoardSizeChange}
          className="w-full"
          disabled={gameStarted}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Game Mode</label>
        <div className="flex space-x-4 text-gray-700">
          <label className="flex items-center">
            <input
              type="radio"
              name="gameMode"
              value="simple"
              checked={gameMode === 'simple'}
              onChange={() => setGameMode('simple')}
              disabled={gameStarted}
              className="mr-2"
            />
            <span>Simple</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="gameMode"
              value="general"
              checked={gameMode === 'general'}
              onChange={() => setGameMode('general')}
              disabled={gameStarted}
              className="mr-2"
            />
            <span>General</span>
          </label>
        </div>
      </div>

      {gameStarted && (
        <>
          <div className={`p-3 ${currentPlayer === 1 ? 'bg-blue-100' : 'bg-red-100'} rounded-lg`}>
            <p className="font-bold text-gray-700">Current Player: {currentPlayer}</p>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Letter</label>
            <div className="flex space-x-4">
              <label className="flex items-center text-gray-700">
                <input
                  type="radio"
                  name="selectedLetter"
                  value="S"
                  checked={selectedLetter === 'S'}
                  onChange={() => setSelectedLetter('S')}
                  className="mr-2"
                />
                <span className="text-xl font-bold">S</span>
              </label>
              <label className="flex items-center text-gray-700">
                <input
                  type="radio"
                  name="selectedLetter"
                  value="O"
                  checked={selectedLetter === 'O'}
                  onChange={() => setSelectedLetter('O')}
                  className="mr-2"
                />
                <span className="text-xl font-bold">O</span>
              </label>
            </div>
          </div>
        </>
      )}

      <div className="pt-4">
        {!gameStarted ? (
          <button
            onClick={startGame}
            className="w-full py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
          >
            Start Game
          </button>
        ) : (
          <button
            onClick={resetGame}
            className="w-full py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600"
          >
            Reset Game
          </button>
        )}
      </div>
    </div>
  );
};

export default GameOptions;