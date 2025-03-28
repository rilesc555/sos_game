'use client'

import React, { useRef, useEffect } from 'react';
import { SOSGame } from '../game/SOSGame';

type GameBoardProps = {
  boardSize: number;
  gameState: SOSGame;
  handleCellClick: (row: number, col: number) => void;
}

const GameBoard = ({ boardSize, gameState, handleCellClick }: GameBoardProps) => {
  const board = gameState.getBoard();
  const [player1Score, player2Score] = gameState.getScores();
  const currentPlayer = gameState.getCurrentPlayer();
  const lastMoveScore = gameState.getLastMoveScore();
  const isGameOver = gameState.getGameOver();
  const winner = gameState.getWinner();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Calculate cell size based on board dimensions
  const cellSizePx = Math.min(60, 480 / boardSize);
  const boardSizePx = cellSizePx * boardSize;

  // Draw SOS lines. This was weird
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous lines
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Account for padding and gaps
    const padding = 4;
    const gap = 4;

    // Draw lines for each SOS sequence
    const sequences = gameState.getSOSSequences();
    sequences.forEach(({ start, end, player }) => {
      const [startRow, startCol] = start;
      const [endRow, endCol] = end;

      // Calculate positions including padding and gaps
      const startX = padding + startCol * (cellSizePx + gap) + cellSizePx / 2;
      const startY = padding + startRow * (cellSizePx + gap) + cellSizePx / 2;
      const endX = padding + endCol * (cellSizePx + gap) + cellSizePx / 2;
      const endY = padding + endRow * (cellSizePx + gap) + cellSizePx / 2;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      // blue for player 1, red for player 2
      ctx.strokeStyle = player === 1 ? '#2563eb' : '#dc2626'; 
      ctx.lineWidth = 3;
      ctx.stroke();
    });
  }, [gameState, cellSizePx]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex justify-between w-full max-w-md px-4">
        <div className={`text-lg font-bold px-4 py-2 rounded-lg transition-colors
          ${currentPlayer === 1 
            ? 'text-blue-600 bg-blue-50 border-2 border-blue-200' 
            : 'text-gray-600'}`}>
          Player 1: {player1Score}
        </div>
        <div className={`text-lg font-bold px-4 py-2 rounded-lg transition-colors
          ${currentPlayer === 2 
            ? 'text-red-600 bg-red-50 border-2 border-red-200' 
            : 'text-gray-600'}`}>
          Player 2: {player2Score}
        </div>
      </div>

      {lastMoveScore > 0 && (
        <div className="text-green-600 font-bold">
          +{lastMoveScore} SOS formed!
        </div>
      )}

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={boardSizePx}
          height={boardSizePx}
          className="absolute top-0 left-0 pointer-events-none"
        />
        <div 
          className="grid gap-1 bg-gray-300 p-1 rounded-lg" 
          style={{ 
            gridTemplateColumns: `repeat(${boardSize}, ${cellSizePx}px)`,
            gridTemplateRows: `repeat(${boardSize}, ${cellSizePx}px)`
          }}
        >
          {board.map((row, rowIndex) => 
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`flex items-center justify-center bg-white rounded cursor-pointer 
                  ${!isGameOver && !cell ? 'hover:bg-blue-100' : ''} transition-colors`}
                style={{ width: `${cellSizePx}px`, height: `${cellSizePx}px` }}
                onClick={() => !isGameOver && handleCellClick(rowIndex, colIndex)}
              >
                <span className="text-2xl font-bold text-gray-700">
                  {cell}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {isGameOver && (
        <div className="text-xl font-bold text-center p-4">
          {winner === 0 ? (
            <span className="text-gray-600">Game Over - It's a Draw!</span>
          ) : (
            <span className={winner === 1 ? 'text-blue-600' : 'text-red-600'}>
              Player {winner} Wins!
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default GameBoard;