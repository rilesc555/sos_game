"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import GameBoard from "../components/GameBoard";
import GameOptions from "../components/GameOptions";
import { SOSGame } from "game/SOSGame";
import { GeneralGame } from "game/GeneralGame";
import { SimpleGame } from "game/SimpleGame";
import GameBoardPreview from "../components/GameBoardPreview";
import { Player } from "game/Player";
import { HumanPlayer } from "game/HumanPlayer";

export default function App() {
    const [gameState, setGameState] = useState<SOSGame | null>(null);
    const [boardSize, setBoardSize] = useState(6);
    const [gameMode, setGameMode] = useState("simple");
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [selectedLetter, setSelectedLetter] = useState("S");
    const [gameStarted, setGameStarted] = useState(false);
    const [player1, setPlayer1] = useState<Player>(new HumanPlayer(1));
    const [player2, setPlayer2] = useState<Player>(new HumanPlayer(2));
    const [isComputerMoving, setIsComputerMoving] = useState(false);
    const computerMoveTimerRef = useRef<Timer | null>(null);

    // effect to start new game
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

    // Effect to handle computer moves
    useEffect(() => {
        const makeComputerMove = async () => {
            computerMoveTimerRef.current = null;
            try {
                const currentGameState = gameState;
                if (
                    !gameStarted ||
                    !currentGameState ||
                    currentGameState.getGameOver()
                ) {
                    setIsComputerMoving(false);
                    return;
                }
                setIsComputerMoving(true);
                const currentPlayerObj =
                    currentGameState.getCurrentPlayerObject();
                const move = await currentPlayerObj.getMove(currentGameState);

                if (!gameStarted || !gameState || gameState.getGameOver()) {
                    // Ensure state is reset if game ended during async operation
                    setIsComputerMoving(false);
                    return;
                }

                if (move) {
                    const moveSuccess = currentGameState.placeMove(
                        move.row,
                        move.column,
                        move.letter,
                        currentPlayer
                    );
                    if (moveSuccess) {
                        const newGameState: SOSGame = currentGameState.clone();
                        setGameState(newGameState);
                        if (
                            newGameState.getLastMoveScore() === 0 ||
                            gameMode === "simple"
                        ) {
                            setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
                        }
                    } else {
                        setIsComputerMoving(false);
                    }
                } else {
                    setIsComputerMoving(false);
                }
            } catch (error) {
                console.error("Error in computer move:", error);
                setIsComputerMoving(false);
            } finally {
                setIsComputerMoving(false);
            }
        };

        if (computerMoveTimerRef.current) {
            clearTimeout(computerMoveTimerRef.current);
            computerMoveTimerRef.current = null;
        }

        if (
            !gameStarted ||
            !gameState ||
            isComputerMoving ||
            gameState.getGameOver()
        ) {
            return;
        }

        const currentPlayerObj = gameState.getCurrentPlayerObject();
        if (currentPlayerObj.getType() === "computer") {
            const delay = 500;
            computerMoveTimerRef.current = setTimeout(makeComputerMove, delay);
        }

        return () => {
            if (computerMoveTimerRef.current) {
                clearTimeout(computerMoveTimerRef.current);
                computerMoveTimerRef.current = null;
            }
        };
    }, [gameState, currentPlayer, gameMode, gameStarted, isComputerMoving]);

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
                const newGameState = gameState.clone();
                setGameState(newGameState);

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

    const startGame = useCallback(() => {
        setGameStarted(true);
    }, []);

    const resetGame = useCallback(() => {
        setGameStarted(false);

        if (computerMoveTimerRef.current) {
            clearTimeout(computerMoveTimerRef.current);
            computerMoveTimerRef.current = null;
        }

        setCurrentPlayer(1);
        setSelectedLetter("S");

        console.log("Game reset initiated.");
    }, []);

    const handleBoardSizeChange = useCallback((size: number) => {
        setBoardSize(size);
    }, []);

    const handleGameModeChange = useCallback((mode: string) => {
        setGameMode(mode);
    }, []);

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
