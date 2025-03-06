'use client'

import { useState, useEffect } from 'react';
import GameBoard from '../components/GameBoard';
import GameOptions from '../components/GameOptions';
import { SOSGame } from '../game/SOSGame';
import GameBoardPreview from '../components/GameBoardPreview';

export default function App() {
  // Game state
  const [gameState, setGameState] = useState(null);
  const [boardSize, setBoardSize] = useState(6);
  const [gameMode, setGameMode] = useState('simple');
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 or 2
  const [selectedLetter, setSelectedLetter] = useState('S');
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      const game = new SOSGame(boardSize, gameMode);
      setGameState(game);
    }
  }, [gameStarted, boardSize, gameMode]);

  // Handle cell click for placing S or O
  const handleCellClick = (row, col) => {
    if (!gameState || gameState.getCell(row, col) !== '') return;
    
    gameState.placeMove(row, col, selectedLetter, currentPlayer);
    setGameState({ ...gameState }); // Trigger re-render
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  // Start new game
  const startGame = () => {
    setGameStarted(true);
  };

  // Reset game
  const resetGame = () => {
    setGameStarted(false);
    setGameState(null);
    setCurrentPlayer(1);
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-4xl font-bold text-center mb-6">SOS Game</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Game Options</h2>
          <GameOptions 
            boardSize={boardSize}
            setBoardSize={setBoardSize}
            gameMode={gameMode}
            setGameMode={setGameMode}
            currentPlayer={currentPlayer}
            selectedLetter={selectedLetter}
            setSelectedLetter={setSelectedLetter}
            gameStarted={gameStarted}
            startGame={startGame}
            resetGame={resetGame}
          />
        </div>
        
        <div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Game Board</h2>
          {gameStarted && gameState ? (
            <GameBoard 
              boardSize={boardSize}
              gameState={gameState}
              handleCellClick={handleCellClick}
            />
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-xl font-semibold mb-4">Preview (game not started)</p>
              <GameBoardPreview boardSize={boardSize} />
            </div>
          )}
        </div>
      </div>
</div>
  );
}