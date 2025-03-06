'use client'

import React from 'react';
import { SOSGame } from '../game/SOSGame';

type GameBoardProps = {
  boardSize: number;
  gameState: SOSGame;
  handleCellClick: (row: number, col: number) => void;
}

const GameBoard = ({ boardSize, gameState, handleCellClick }: GameBoardProps) => {
  const board = gameState.getBoard();
  
  // Calculate cell size based on board dimensions
  const cellSizePx = Math.min(60, 480 / boardSize);
  
  return (
    <div className="flex flex-col items-center">
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
              className="flex items-center justify-center bg-white rounded cursor-pointer hover:bg-blue-100 transition-colors"
              style={{ width: `${cellSizePx}px`, height: `${cellSizePx}px` }}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              <span className="text-2xl font-bold">
                {cell}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;