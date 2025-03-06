'use client'

import React from 'react';

type GameBoardPreviewProps = {
  boardSize: number;
}

const GameBoardPreview = ({ boardSize }: GameBoardPreviewProps) => {
  // Generate an empty preview board
  const previewBoard = Array(boardSize).fill(null)
    .map(() => Array(boardSize).fill(''));
  
  // Calculate cell size based on board dimensions (same logic as GameBoard)
  const cellSizePx = Math.min(60, 480 / boardSize);
  
  return (
    <div className="flex flex-col items-center opacity-70">
      <div 
        className="grid gap-1 bg-gray-300 p-1 rounded-lg" 
        style={{ 
          gridTemplateColumns: `repeat(${boardSize}, ${cellSizePx}px)`,
          gridTemplateRows: `repeat(${boardSize}, ${cellSizePx}px)`
        }}
      >
        {previewBoard.map((row, rowIndex) => 
          row.map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="flex items-center justify-center bg-white rounded"
              style={{ width: `${cellSizePx}px`, height: `${cellSizePx}px` }}
            >
              {/* Empty cells for preview */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoardPreview;