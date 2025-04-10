"use client";

import React, { useRef, useEffect, useState } from "react";
import { SOSGame } from "game/SOSGame";

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
    const lastMoveScore = gameState.getLastMoveScore();
    const isGameOver = gameState.getGameOver();
    const winner = gameState.getWinner();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // State to control animation
    const [animatePlayer, setAnimatePlayer] = useState<number | null>(null);
    const [animationType, setAnimationType] = useState<
        "single" | "double" | null
    >(null);
    const [animationKey, setAnimationKey] = useState<number>(0);

    // Calculate cell size based on board dimensions
    const cellSizePx = Math.min(60, 480 / boardSize);
    const boardSizePx = cellSizePx * boardSize;

    // Handle SOS formations and trigger appropriate animation
    useEffect(() => {
        if (lastMoveScore > 0 && !gameState.isSosMessageShown()) {
            console.log(
                "Triggering animation for player",
                currentPlayer,
                "with score",
                lastMoveScore
            );

            // Determine which animation to use based on number of SOS sequences
            const animType = lastMoveScore === 1 ? "single" : "double";

            setAnimatePlayer(currentPlayer);
            setAnimationType(animType);
            setAnimationKey(Date.now());

            // Mark animation as shown
            gameState.setSosMessageShown();

            // Reset animation after it completes
            const timer = setTimeout(
                () => {
                    setAnimatePlayer(null);
                    setAnimationType(null);
                },
                animType === "single" ? 600 : 1100
            ); // Allow extra time for double animation

            console.log("finishing animation");
            return () => clearTimeout(timer);
        }
    }, [lastMoveScore, gameState, currentPlayer]);

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

    // Define animation styles as objects
    const singlePulseStyle = {
        animation: "score-pulse-single 0.5s ease-in-out",
        boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.7)",
    };

    const doublePulseStyle = {
        animation: "score-pulse-double 1s ease-in-out",
        boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.7)",
    };

    // Helper to get the correct animation class
    const getAnimationClass = (playerNum: number) => {
        if (animatePlayer !== playerNum || !animationType) return "";
        return `animate-score-pulse-${animationType}`;
    };

    // Helper to get animation style
    const getAnimationStyle = (playerNum: number) => {
        if (animatePlayer !== playerNum || !animationType) return {};
        return animationType === "single" ? singlePulseStyle : doublePulseStyle;
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="flex justify-between items-center w-full max-w-md px-4">
                <div
                    key={
                        animatePlayer === 1
                            ? `p1-animate-${animationKey}`
                            : "p1-static"
                    }
                    className={`text-lg font-bold px-4 py-2 rounded-lg transition-colors
            ${
                currentPlayer === 1
                    ? "text-blue-600 bg-blue-50 border-2 border-blue-200"
                    : "text-gray-600"
            }
            ${getAnimationClass(1)}`}
                    style={getAnimationStyle(1)}
                >
                    Player 1: {player1Score} {animatePlayer === 1}
                </div>

                <div
                    key={
                        animatePlayer === 2
                            ? `p2-animate-${animationKey}`
                            : "p2-static"
                    }
                    className={`text-lg font-bold px-4 py-2 rounded-lg transition-colors
            ${
                currentPlayer === 2
                    ? "text-red-600 bg-red-50 border-2 border-red-200"
                    : "text-gray-600"
            }
            ${getAnimationClass(2)}`}
                    style={getAnimationStyle(2)}
                >
                    Player 2: {player2Score} {animatePlayer === 2}
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
                                className={`flex items-center justify-center bg-white rounded cursor-pointer 
                  ${
                      !isGameOver && !cell && !isComputerMoving
                          ? "hover:bg-blue-100"
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
                                        !isComputerMoving
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
