"use client";

import React, { useRef, useEffect } from "react";
import { SOSGame } from "game/SOSGame";
import { HumanPlayer } from "game/HumanPlayer";
import { animate } from "motion";

type GameBoardProps = {
    boardSize: number;
    gameState: SOSGame;
    handleCellClick: (row: number, col: number) => void;
    isComputerMoving: boolean;
};

const GameBoard = ({
    boardSize,
    gameState,
    handleCellClick,
    isComputerMoving,
}: GameBoardProps) => {
    const board = gameState.getBoard();
    const [player1Score, player2Score] = gameState.getScores();
    const currentPlayer = gameState.getCurrentPlayer();
    const isGameOver = gameState.getGameOver();
    const winner = gameState.getWinner();
    const player1Ref = useRef<HTMLDivElement>(null);
    const prevPlayer1ScoreRef = useRef(player1Score);
    const player2Ref = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isInitialMountPlayer1 = useRef(true);
    const isInitialMountPlayer2 = useRef(true);

    // Calculate cell size based on board dimensions
    const cellSizePx = Math.min(60, 480 / boardSize);
    const boardSizePx = cellSizePx * boardSize;

    // Effect to animate player 1 when score changes
    useEffect(() => {
        if (isInitialMountPlayer1.current) {
            isInitialMountPlayer1.current = false;
            return;
        }
        const scoreDiff = player1Score - prevPlayer1ScoreRef.current;
        if (scoreDiff > 0 && player1Ref.current) {
            console.log("Score difference: ", scoreDiff);
            if (scoreDiff == 2) {
                const animation = animate(
                    player1Ref.current,
                    { scale: [1, 1.2, 1.1, 1.25, 1] }, // Keyframes: start -> peak1 -> dip -> peak2 -> end
                    {
                        duration: 0.5, // Duration for one full double pulse cycle
                        ease: "easeInOut",
                        times: [0, 0.25, 0.5, 0.75, 1], // Timing for each keyframe
                    }
                );
            }
            // const animation = animate(
            //     player1Ref.current,
            //     { scale: [1, 1.2, 1] },
            //     { repeat: scoreDiff - 1, duration: 0.25 }
            // );
        }
        prevPlayer1ScoreRef.current = player1Score;

        return () => {};
    }, [player1Score]);

    // Draw SOS lines
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
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
            const startX =
                padding + startCol * (cellSizePx + gap) + cellSizePx / 2;
            const startY =
                padding + startRow * (cellSizePx + gap) + cellSizePx / 2;
            const endX = padding + endCol * (cellSizePx + gap) + cellSizePx / 2;
            const endY = padding + endRow * (cellSizePx + gap) + cellSizePx / 2;

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            // blue for player 1, red for player 2
            ctx.strokeStyle = player === 1 ? "#2563eb" : "#dc2626";
            ctx.lineWidth = 3;
            ctx.stroke();
        });
    }, [gameState, cellSizePx]);

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="flex justify-between items-center w-full max-w-md px-4">
                <div
                    ref={player1Ref}
                    className={`text-lg font-bold px-4 py-2 rounded-lg transition-colors
            ${
                currentPlayer === 1
                    ? "text-blue-600 bg-blue-50 border-2 border-blue-200"
                    : "text-gray-600"
            }
            `}
                >
                    Player 1: {player1Score}
                </div>

                <div
                    ref={player2Ref}
                    className={`text-lg font-bold px-4 py-2 rounded-lg transition-colors
            ${
                currentPlayer === 2
                    ? "text-red-600 bg-red-50 border-2 border-red-200"
                    : "text-gray-600"
            }
            `}
                >
                    Player 2: {player2Score}
                </div>
            </div>

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
                        gridTemplateRows: `repeat(${boardSize}, ${cellSizePx}px)`,
                    }}
                >
                    {board.map((row: (string | null)[], rowIndex: number) =>
                        row.map((cell, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`flex items-center justify-center bg-white rounded 
                  ${
                      !isGameOver &&
                      !cell &&
                      gameState.getCurrentPlayerObject() instanceof HumanPlayer
                          ? "cursor-pointer hover:bg-blue-100"
                          : ""
                  } 
                  ${isComputerMoving ? "opacity-50" : ""} transition-colors`}
                                style={{
                                    width: `${cellSizePx}px`,
                                    height: `${cellSizePx}px`,
                                }}
                                onClick={() => {
                                    if (
                                        !isGameOver &&
                                        handleCellClick &&
                                        gameState.getCurrentPlayerObject() instanceof
                                            HumanPlayer
                                    ) {
                                        handleCellClick(rowIndex, colIndex);
                                    }
                                }}
                            >
                                <span className="text-2xl font-bold text-gray-700">
                                    {cell}
                                </span>
                            </div>
                        ))
                    )}
                </div>
                {isComputerMoving && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded-lg">
                        <div className="text-lg font-bold text-gray-700">
                            Player {currentPlayer} is thinking...
                        </div>
                    </div>
                )}
            </div>

            {isGameOver && (
                <div className="text-xl font-bold text-center p-4">
                    {winner === 0 ? (
                        <span className="text-gray-600">
                            Game Over - It&apos;s a Draw!
                        </span>
                    ) : (
                        <span
                            className={
                                winner === 1 ? "text-blue-600" : "text-red-600"
                            }
                        >
                            Player {winner} Wins!
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default GameBoard;
