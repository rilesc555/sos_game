'use client'

import { useState, useEffect, useCallback } from 'react';
import GameBoard from '../components/GameBoard';
import GameOptions from '../components/GameOptions';
import { SOSGame } from '../game/SOSGame';
import GameBoardPreview from '../components/GameBoardPreview';

export default function App() {
  // Game state
  const [gameState, setGameState] = useState<SOSGame | null>(null);
  const [boardSize, setBoardSize] = useState(6);
  const [gameMode, setGameMode] = useState('simple');
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 or 2
  const [selectedLetter, setSelectedLetter] = useState('S');
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      const game = new SOSGame(boardSize, gameMode);
      setGameState(game);
      setCurrentPlayer(1);
    }
  }, [gameStarted, boardSize, gameMode]);

  // Handle cell click for placing S or O. Now with callbacks!
  const handleCellClick = useCallback((row: number, col: number) => {
    if (!gameState || gameState.getCell(row, col) !== '') return;
    
    const moveSuccess = gameState.placeMove(row, col, selectedLetter, currentPlayer);
    if (moveSuccess) {
      // Create a new instance to trigger re-render
      const newGameState = gameState.clone();
      setGameState(newGameState);
      
      // If a player makes an SOS, they get another turn (except in simple mode)
      if (newGameState.getLastMoveScore() === 0 || gameMode === 'simple') {
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }
    }
  }, [gameState, selectedLetter, currentPlayer, gameMode]);

  // Start new game
  const startGame = useCallback(() => {
    setGameStarted(true);
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    setGameStarted(false);
    setGameState(null);
    setCurrentPlayer(1);
    setSelectedLetter('S');
  }, []);

  // Board size handler
  const handleBoardSizeChange = useCallback((size: number) => {
    setBoardSize(size);
  }, []);

  // Game mode handler
  const handleGameModeChange = useCallback((mode: string) => {
    setGameMode(mode);
  }, []);

  // Letter selection handler
  const handleLetterSelect = useCallback((letter: string) => {
    setSelectedLetter(letter);
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-5xl font-black text-center mb-6 text-gray-800">SOS Game</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 bg-gray-100 p-6 rounded-lg border-2 border-gray-300">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Game Options</h2>
          <GameOptions 
            boardSize={boardSize}
            setBoardSize={handleBoardSizeChange}
            gameMode={gameMode}
            setGameMode={handleGameModeChange}
            currentPlayer={currentPlayer}
            selectedLetter={selectedLetter}
            setSelectedLetter={handleLetterSelect}
            gameStarted={gameStarted}
            startGame={startGame}
            resetGame={resetGame}
          />
        </div>
        
        <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Game Board</h2>
          {gameStarted && gameState ? (
            <GameBoard 
              boardSize={boardSize}
              gameState={gameState}
              handleCellClick={handleCellClick}
            />
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-2xl font-bold mb-4 text-gray-800">Preview (game not started)</p>
              <GameBoardPreview boardSize={boardSize} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}