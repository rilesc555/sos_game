"use client";

import { useState, useEffect, useCallback } from "react";
import GameBoard from "../components/GameBoard";
import GameOptions from "../components/GameOptions";
import { SOSGame } from "game/SOSGame";
import { GeneralGame } from "game/GeneralGame";
import { SimpleGame } from "game/SimpleGame";
import GameBoardPreview from "../components/GameBoardPreview";
import { Player } from "game/Player";
import { HumanPlayer } from "game/HumanPlayer";
import { ComputerPlayer } from "game/ComputerPlayer";

export default function App() {
    // Game state
    const [gameState, setGameState] = useState<SOSGame | null>(null);
    const [boardSize, setBoardSize] = useState(6);
    const [gameMode, setGameMode] = useState("simple");
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [selectedLetter, setSelectedLetter] = useState("S");
    const [gameStarted, setGameStarted] = useState(false);
    const [player1, setPlayer1] = useState<Player>(new HumanPlayer(1));
    const [player2, setPlayer2] = useState<Player>(new HumanPlayer(2));
    const [isComputerMoving, setIsComputerMoving] = useState(false);

    useEffect(() => {
        if (gameStarted) {
            const game =
                gameMode === "general"
                    ? new GeneralGame(boardSize, player1, player2)
                    : new SimpleGame(boardSize, player1, player2);
            setGameState(game);
            setCurrentPlayer(1);
        }
    }, [gameStarted, boardSize, gameMode, player1, player2]);

    // Handle computer moves
    useEffect(() => {
        if (
            !gameStarted ||
            !gameState ||
            isComputerMoving ||
            gameState.getGameOver()
        )
            return;

        const currentPlayerObj = gameState.getCurrentPlayerObject();
        if (currentPlayerObj.getType() === "computer") {
            // Add a 1 second delay before the computer makes its move
            console.log(`Computer player ${currentPlayer} is making a move...`);
            const delay = 1000;
            setIsComputerMoving(true);

            const makeComputerMove = async () => {
                try {
                    // Wait for the delay before making the move
                    await new Promise((resolve) => setTimeout(resolve, delay));

                    const move = await currentPlayerObj.getMove(gameState);
                    if (move) {
                        const moveSuccess = gameState.placeMove(
                            move.row,
                            move.column,
                            move.letter,
                            currentPlayer
                        );
                        if (moveSuccess) {
                            const newGameState: SOSGame = gameState.clone();
                            setGameState(newGameState);

                            if (
                                newGameState.getLastMoveScore() === 0 ||
                                gameMode === "simple"
                            ) {
                                setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
                            }
                        }
                    }
                } finally {
                    setIsComputerMoving(false);
                }
            };

            makeComputerMove();
        } else {
            console.log("for some reason this is a human moving?!");
        }
    }, [gameState, currentPlayer, gameMode, gameStarted, isComputerMoving]);

    // Handle cell click for placing S or O
    const handleCellClick = useCallback(
        (row: number, col: number) => {
            console.log(`Trying to click on row ${row}, column ${col}`);
            if (
                !gameState ||
                gameState.getCell(row, col) !== "" ||
                isComputerMoving
            )
                return;

            const currentPlayerObj = gameState.getCurrentPlayerObject();
            if (currentPlayerObj.getType() === "computer") return;

            const moveSuccess = gameState.placeMove(
                row,
                col,
                selectedLetter,
                currentPlayer
            );

            if (moveSuccess) {
                // Create a new instance to trigger re-render
                const newGameState = gameState.clone();
                setGameState(newGameState);

                // If a player makes an SOS, they get another turn (except in simple mode)
                if (
                    newGameState.getLastMoveScore() === 0 ||
                    gameMode === "simple"
                ) {
                    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
                }
            }
        },
        [gameState, selectedLetter, currentPlayer, gameMode, isComputerMoving]
    );

    // Start new game
    const startGame = useCallback(() => {
        setGameStarted(true);
    }, []);

    // Reset game
    const resetGame = useCallback(() => {
        setGameStarted(false);
        setGameState(null);
        setCurrentPlayer(1);
        setSelectedLetter("S");
        setIsComputerMoving(false);
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
            <h1 className="text-5xl font-black text-center mb-6 text-gray-800">
                SOS Game
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 bg-gray-100 p-6 rounded-lg border-2 border-gray-300">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">
                        Game Options
                    </h2>
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
                        player1={player1}
                        player2={player2}
                        setPlayer1={setPlayer1}
                        setPlayer2={setPlayer2}
                    />
                </div>

                <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">
                        Game Board
                    </h2>
                    {gameStarted && gameState ? (
                        <GameBoard
                            boardSize={boardSize}
                            gameState={gameState}
                            handleCellClick={handleCellClick}
                            isComputerMoving={isComputerMoving}
                        />
                    ) : (
                        <div className="flex flex-col items-center">
                            <p className="text-2xl font-bold mb-4 text-gray-800">
                                Preview (game not started)
                            </p>
                            <GameBoardPreview boardSize={boardSize} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
