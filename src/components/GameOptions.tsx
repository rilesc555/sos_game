"use client";

import React from "react";
import { Player } from "game/Player";
import { HumanPlayer } from "game/HumanPlayer";
import { ComputerPlayer } from "game/ComputerPlayer";
import { AiPlayer } from "game/AiPlayer";

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
    player1: Player;
    player2: Player;
    setPlayer1: (player: Player) => void;
    setPlayer2: (player: Player) => void;
};

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
    resetGame,
    player1,
    player2,
    setPlayer1,
    setPlayer2,
}: GameOptionsProps) => {
    const handleBoardSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const size = parseInt(e.target.value);
        if (size >= 3 && size <= 12) {
            setBoardSize(size);
        }
    };

    const handlePlayerTypeChange = (
        playerNumber: number,
        type: "human" | "computer" | "ai"
    ) => {
        if (playerNumber === 1) {
            if (type === "human") {
                setPlayer1(new HumanPlayer(1));
            } else if (type === "computer") {
                setPlayer1(new ComputerPlayer(1));
            } else if (type === "ai") {
                setPlayer1(new AiPlayer(1));
            }
        } else {
            if (type === "human") {
                setPlayer2(new HumanPlayer(1));
            } else if (type === "computer") {
                setPlayer2(new ComputerPlayer(1));
            } else if (type === "ai") {
                setPlayer2(new AiPlayer(1));
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Board Size: {boardSize}x{boardSize}
                </label>
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
                <label className="block text-sm font-medium text-gray-700">
                    Game Mode
                </label>
                <div className="flex space-x-4 text-gray-700">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="gameMode"
                            value="simple"
                            checked={gameMode === "simple"}
                            onChange={() => setGameMode("simple")}
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
                            checked={gameMode === "general"}
                            onChange={() => setGameMode("general")}
                            disabled={gameStarted}
                            className="mr-2"
                        />
                        <span>General</span>
                    </label>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Player 1 Type
                </label>
                <div className="flex space-x-4">
                    <label className="flex items-center text-gray-700">
                        <input
                            type="radio"
                            name="player1Type"
                            value="human"
                            checked={player1.getType() === "human"}
                            onChange={() => handlePlayerTypeChange(1, "human")}
                            disabled={gameStarted}
                            className="mr-2"
                        />
                        <span>Human</span>
                    </label>
                    <label className="flex items-center text-gray-700">
                        <input
                            type="radio"
                            name="player1Type"
                            value="computer"
                            checked={player1.getType() === "computer"}
                            onChange={() =>
                                handlePlayerTypeChange(1, "computer")
                            }
                            disabled={gameStarted}
                            className="mr-2"
                        />
                        <span>Computer</span>
                    </label>
                    <label className="flex items-center text-gray-700">
                        <input
                            type="radio"
                            name="player1Type"
                            value="computer"
                            checked={player1.getType() === "ai"}
                            onChange={() => handlePlayerTypeChange(1, "ai")}
                            disabled={gameStarted}
                            className="mr-2"
                        />
                        <span>Computer</span>
                    </label>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Player 2 Type
                </label>
                <div className="flex space-x-4">
                    <label className="flex items-center text-gray-700">
                        <input
                            type="radio"
                            name="player2Type"
                            value="human"
                            checked={player2.getType() === "human"}
                            onChange={() => handlePlayerTypeChange(2, "human")}
                            disabled={gameStarted}
                            className="mr-2"
                        />
                        <span>Human</span>
                    </label>
                    <label className="flex items-center text-gray-700">
                        <input
                            type="radio"
                            name="player2Type"
                            value="computer"
                            checked={player2.getType() === "computer"}
                            onChange={() =>
                                handlePlayerTypeChange(2, "computer")
                            }
                            disabled={gameStarted}
                            className="mr-2"
                        />
                        <span>Computer (local)</span>
                    </label>
                    <label className="flex items-center text-gray-700">
                        <input
                            type="radio"
                            name="player2Type"
                            value="ai"
                            checked={player2.getType() === "ai"}
                            onChange={() => handlePlayerTypeChange(2, "ai")}
                            disabled={gameStarted}
                            className="mr-2"
                        />
                        <span>AI (Gemini)</span>
                    </label>
                </div>
            </div>

            {gameStarted && (
                <>
                    <div
                        className={`p-3 ${
                            currentPlayer === 1 ? "bg-blue-100" : "bg-red-100"
                        } rounded-lg`}
                    >
                        <p className="font-bold text-gray-700">
                            Current Player: {currentPlayer}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Select Letter
                        </label>
                        <div className="flex space-x-4">
                            <label className="flex items-center text-gray-700">
                                <input
                                    type="radio"
                                    name="selectedLetter"
                                    value="S"
                                    checked={selectedLetter === "S"}
                                    onChange={() => setSelectedLetter("S")}
                                    className="mr-2"
                                />
                                <span className="text-xl font-bold">S</span>
                            </label>
                            <label className="flex items-center text-gray-700">
                                <input
                                    type="radio"
                                    name="selectedLetter"
                                    value="O"
                                    checked={selectedLetter === "O"}
                                    onChange={() => setSelectedLetter("O")}
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
