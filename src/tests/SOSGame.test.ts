import { expect, test, describe, beforeEach, jest } from "bun:test";

import { SimpleGame } from "../game/SimpleGame";
import { GeneralGame } from "../game/GeneralGame";
import { HumanPlayer } from "../game/HumanPlayer";
import { Player } from "../game/Player";
import { ComputerPlayer } from "../game/ComputerPlayer";

// Board Initialization Tests
describe("Board Initialization", () => {
    let player1: Player;
    let player2: Player;

    beforeEach(() => {
        player1 = new HumanPlayer(1);
        player2 = new HumanPlayer(2);
    });

    test("should initialize SimpleGame with empty board of correct size", () => {
        const game = new SimpleGame(6, player1, player2);
        const board = game.getBoard();
        expect(board.length).toBe(6);
        expect(board[0].length).toBe(6);

        // All cells should be empty
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 6; col++) {
                expect(game.getCell(row, col)).toBe("");
            }
        }
    });

    test("should initialize GeneralGame with empty board of correct size", () => {
        const game = new GeneralGame(6, player1, player2);
        const board = game.getBoard();

        expect(board.length).toBe(6);
        expect(board[0].length).toBe(6);

        // All cells should be empty
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 6; col++) {
                expect(game.getCell(row, col)).toBe("");
            }
        }
    });

    test("should allow board sizes between 3x3 and 12x12 for SimpleGame", () => {
        // Test minimum size
        const minGame = new SimpleGame(3, player1, player2);
        expect(minGame.getBoard().length).toBe(3);

        // Test maximum size
        const maxGame = new SimpleGame(12, player1, player2);
        expect(maxGame.getBoard().length).toBe(12);
    });

    test("should allow board sizes between 3x3 and 12x12 for GeneralGame", () => {
        // Test minimum size
        const minGame = new GeneralGame(3, player1, player2);
        expect(minGame.getBoard().length).toBe(3);

        // Test maximum size
        const maxGame = new GeneralGame(12, player1, player2);
        expect(maxGame.getBoard().length).toBe(12);
    });
});

// Game Mode Tests
describe("Game Modes", () => {
    let player1: Player;
    let player2: Player;

    beforeEach(() => {
        player1 = new HumanPlayer(1);
        player2 = new HumanPlayer(2);
    });

    test("SimpleGame should end on first SOS", () => {
        const game = new SimpleGame(3, player1, player2);

        game.placeMove(0, 0, "S", 1);
        game.placeMove(0, 1, "O", 2);
        game.placeMove(0, 2, "S", 1);

        // Game should be over after first SOS in simple mode
        expect(game.getGameOver()).toBe(true);
        expect(game.getWinner()).toBe(1);
    });

    test("GeneralGame should continue after SOS", () => {
        const game = new GeneralGame(3, player1, player2);

        game.placeMove(0, 0, "S", 1);
        game.placeMove(0, 1, "O", 2);
        game.placeMove(0, 2, "S", 1);

        // Game should continue after SOS in general mode
        expect(game.getGameOver()).toBe(false);

        // Fill the rest of the board
        game.placeMove(1, 0, "S", 2);
        game.placeMove(1, 1, "O", 1);
        game.placeMove(1, 2, "S", 2);
        game.placeMove(2, 0, "S", 1);
        game.placeMove(2, 1, "O", 2);
        game.placeMove(2, 2, "S", 1);

        // Now game should be over
        expect(game.getGameOver()).toBe(true);
    });
});

// Move Placement Tests
describe("Move Placement", () => {
    let player1: Player;
    let player2: Player;

    beforeEach(() => {
        player1 = new HumanPlayer(1);
        player2 = new HumanPlayer(2);
    });

    test("should place S and O on the board correctly (SimpleGame)", () => {
        const game = new SimpleGame(3, player1, player2);

        // Place 'S' at (0,0)
        expect(game.placeMove(0, 0, "S", 1)).toBe(true);
        expect(game.getCell(0, 0)).toBe("S");

        // Place 'O' at (1,1)
        expect(game.placeMove(1, 1, "O", 2)).toBe(true);
        expect(game.getCell(1, 1)).toBe("O");
    });

    test("should place S and O on the board correctly (GeneralGame)", () => {
        const game = new GeneralGame(3, player1, player2);

        // Place 'S' at (0,0)
        expect(game.placeMove(0, 0, "S", 1)).toBe(true);
        expect(game.getCell(0, 0)).toBe("S");

        // Place 'O' at (1,1)
        expect(game.placeMove(1, 1, "O", 2)).toBe(true);
        expect(game.getCell(1, 1)).toBe("O");
    });

    test("should not allow placing on occupied cell (SimpleGame)", () => {
        const game = new SimpleGame(3, player1, player2);

        // Place 'S' at (0,0)
        expect(game.placeMove(0, 0, "S", 1)).toBe(true);

        // Try to place 'O' on the same cell
        expect(game.placeMove(0, 0, "O", 2)).toBe(false);
        expect(game.getCell(0, 0)).toBe("S"); // Should remain 'S'
    });

    test("should not allow placing on occupied cell (GeneralGame)", () => {
        const game = new GeneralGame(3, player1, player2);

        // Place 'S' at (0,0)
        expect(game.placeMove(0, 0, "S", 1)).toBe(true);

        // Try to place 'O' on the same cell
        expect(game.placeMove(0, 0, "O", 2)).toBe(false);
        expect(game.getCell(0, 0)).toBe("S"); // Should remain 'S'
    });

    test("should not allow invalid moves outside board (SimpleGame)", () => {
        const game = new SimpleGame(3, player1, player2);
        expect(game.placeMove(-1, 0, "S", 1)).toBe(false);
        expect(game.placeMove(0, -1, "S", 1)).toBe(false);
        expect(game.placeMove(3, 0, "S", 1)).toBe(false);
        expect(game.placeMove(0, 3, "S", 1)).toBe(false);
    });

    test("should not allow invalid moves outside board (GeneralGame)", () => {
        const game = new GeneralGame(3, player1, player2);
        expect(game.placeMove(-1, 0, "S", 1)).toBe(false);
        expect(game.placeMove(0, -1, "S", 1)).toBe(false);
        expect(game.placeMove(3, 0, "S", 1)).toBe(false);
        expect(game.placeMove(0, 3, "S", 1)).toBe(false);
    });
});

// SOS Detection Tests
describe("SOS Detection", () => {
    let player1: Player;
    let player2: Player;

    beforeEach(() => {
        player1 = new HumanPlayer(1);
        player2 = new HumanPlayer(2);
    });

    test("should detect horizontal SOS (SimpleGame)", () => {
        const game = new SimpleGame(3, player1, player2);
        game.placeMove(0, 0, "S", 1);
        game.placeMove(0, 1, "O", 1);
        game.placeMove(0, 2, "S", 1);
        expect(game.getLastMoveScore()).toBe(1);
    });

    test("should detect vertical SOS (GeneralGame)", () => {
        const game = new GeneralGame(3, player1, player2);
        game.placeMove(0, 0, "S", 1);
        game.placeMove(1, 0, "O", 1);
        game.placeMove(2, 0, "S", 1);
        expect(game.getLastMoveScore()).toBe(1);
    });

    test("should detect diagonal SOS (SimpleGame)", () => {
        const game = new SimpleGame(3, player1, player2);
        game.placeMove(0, 0, "S", 1);
        game.placeMove(1, 1, "O", 1);
        game.placeMove(2, 2, "S", 1);
        expect(game.getLastMoveScore()).toBe(1);
    });

    test("should track SOS sequences with player information (GeneralGame)", () => {
        const game = new GeneralGame(3, player1, player2);
        game.placeMove(0, 0, "S", 1);
        game.placeMove(0, 1, "O", 2);
        game.placeMove(0, 2, "S", 1);

        const sequences = game.getSOSSequences();
        expect(sequences.length).toBe(1);
        expect(sequences[0].player).toBe(1);
        expect(sequences[0].start).toEqual([0, 0]);
        expect(sequences[0].end).toEqual([0, 2]);
    });
});

// Game Over Conditions Tests
describe("Game Over Conditions", () => {
    let player1: Player;
    let player2: Player;

    beforeEach(() => {
        player1 = new HumanPlayer(1);
        player2 = new HumanPlayer(2);
    });

    test("should detect when board is full (SimpleGame)", () => {
        const game = new SimpleGame(2, player1, player2);

        // Initially board is not full
        expect(game.isBoardFull()).toBe(false);

        // Fill the board
        game.placeMove(0, 0, "S", 1);
        game.placeMove(0, 1, "O", 2);
        game.placeMove(1, 0, "S", 1);
        game.placeMove(1, 1, "O", 2);

        expect(game.isBoardFull()).toBe(true);
    });

    test("should detect when board is full (GeneralGame)", () => {
        const game = new GeneralGame(2, player1, player2);

        // Initially board is not full
        expect(game.isBoardFull()).toBe(false);

        // Fill the board
        game.placeMove(0, 0, "S", 1);
        game.placeMove(0, 1, "O", 2);
        game.placeMove(1, 0, "S", 1);
        game.placeMove(1, 1, "O", 2);

        expect(game.isBoardFull()).toBe(true);
    });

    test("should end SimpleGame on first SOS", () => {
        const game = new SimpleGame(3, player1, player2);
        game.placeMove(0, 0, "S", 1);
        game.placeMove(0, 1, "O", 2);
        game.placeMove(0, 2, "S", 1);

        expect(game.getGameOver()).toBe(true);
        expect(game.getWinner()).toBe(1);
    });

    test("should end SimpleGame when board is full without SOS", () => {
        const game = new SimpleGame(2, player1, player2);
        game.placeMove(0, 0, "S", 1);
        game.placeMove(0, 1, "S", 2);
        game.placeMove(1, 0, "O", 1);
        game.placeMove(1, 1, "O", 2);
        expect(game.getGameOver()).toBe(true);
        expect(game.getWinner()).toBe(0); // Draw if no SOS
    });

    test("should end GeneralGame only when board is full", () => {
        const game = new GeneralGame(3, player1, player2);

        // First SOS
        game.placeMove(0, 0, "S", 1);
        game.placeMove(0, 1, "O", 2);
        game.placeMove(0, 2, "S", 1);

        expect(game.getGameOver()).toBe(false);

        // Fill rest of board
        game.placeMove(1, 0, "S", 2);
        game.placeMove(1, 1, "S", 1);
        game.placeMove(1, 2, "O", 2);
        game.placeMove(2, 0, "O", 1);
        game.placeMove(2, 1, "S", 2);
        game.placeMove(2, 2, "S", 1);

        expect(game.getGameOver()).toBe(true);
    });

    test("should correctly determine winner in GeneralGame based on score", () => {
        const game = new GeneralGame(3, player1, player2);

        // Player 1 makes an SOS
        game.placeMove(0, 0, "S", 1);
        game.placeMove(0, 1, "O", 1);
        game.placeMove(0, 2, "S", 1);

        // Player 2 makes an SOS
        game.placeMove(1, 0, "S", 2);
        game.placeMove(1, 1, "O", 2);
        game.placeMove(1, 2, "S", 2);

        // Fill rest of board without SOS
        game.placeMove(2, 0, "O", 1);
        game.placeMove(2, 1, "O", 2);
        game.placeMove(2, 2, "O", 1);

        expect(game.getGameOver()).toBe(true);
        expect(game.getWinner()).toBe(0); // Draw
    });
});

// Turn Management Tests
describe("Turn Management", () => {
    let player1: Player;
    let player2: Player;

    beforeEach(() => {
        player1 = new HumanPlayer(1);
        player2 = new HumanPlayer(2);
    });

    test("should switch turns after move in SimpleGame if no SOS", () => {
        const game = new SimpleGame(3, player1, player2);
        expect(game.getCurrentPlayer()).toBe(1);

        game.placeMove(0, 0, "S", 1);
        expect(game.getCurrentPlayer()).toBe(2);
    });

    test("should not switch turns after SOS in SimpleGame (game ends)", () => {
        const game = new SimpleGame(3, player1, player2);
        expect(game.getCurrentPlayer()).toBe(1);
        game.placeMove(0, 0, "S", 1);
        game.placeMove(0, 1, "O", 2);
        game.placeMove(0, 2, "S", 1); // Player 1 makes SOS
        // Game is over, current player might not be relevant, but check it doesn't switch unnecessarily
        expect(game.getGameOver()).toBe(true);
        // Depending on implementation, currentPlayer might remain 1 or switch before game over check
    });

    test("should switch turns after move in GeneralGame if no SOS", () => {
        const game = new GeneralGame(3, player1, player2);
        expect(game.getCurrentPlayer()).toBe(1);
        game.placeMove(0, 0, "S", 1); // No SOS
        expect(game.getCurrentPlayer()).toBe(2);
    });

    test("should give extra turn after SOS in GeneralGame", () => {
        const game = new GeneralGame(3, player1, player2);
        expect(game.getCurrentPlayer()).toBe(1);

        // Player 1 makes an SOS
        game.placeMove(0, 0, "S", 1);
        game.placeMove(0, 1, "O", 2);
        game.placeMove(0, 2, "S", 1);

        // Player 1 should get another turn
        expect(game.getCurrentPlayer()).toBe(1);
    });
});

// Score Tracking Tests
describe("Score Tracking", () => {
    let player1: Player;
    let player2: Player;

    beforeEach(() => {
        player1 = new HumanPlayer(1);
        player2 = new HumanPlayer(2);
    });

    test("should track scores correctly in GeneralGame", () => {
        const game = new GeneralGame(3, player1, player2);

        // Player 1 makes an SOS
        game.placeMove(0, 0, "S", 1);
        game.placeMove(0, 1, "O", 1);
        game.placeMove(0, 2, "S", 1);

        const [p1Score, p2Score] = game.getScores();
        expect(p1Score).toBe(1);
        expect(p2Score).toBe(0);
    });

    test("should track scores correctly in SimpleGame (only first SOS counts)", () => {
        const game = new SimpleGame(3, player1, player2);
        game.placeMove(0, 0, "S", 1);
        game.placeMove(0, 1, "O", 2);
        game.placeMove(0, 2, "S", 1); // Player 1 scores 1
        const [p1Score, p2Score] = game.getScores();
        expect(p1Score).toBe(1);
        expect(p2Score).toBe(0);
        // Game should be over, further moves irrelevant for score
        expect(game.getGameOver()).toBe(true);
    });

    test("should handle multiple SOS formations in one move (GeneralGame)", () => {
        const game = new GeneralGame(5, player1, player2);

        // Set up board for multiple SOS
        game.placeMove(2, 1, "S", 1);
        game.placeMove(2, 3, "S", 2);
        game.placeMove(1, 2, "S", 1);
        game.placeMove(3, 2, "S", 2);

        // Place O in center to form 4 SOS patterns
        game.placeMove(2, 2, "O", 1);

        expect(game.getLastMoveScore()).toBe(2); // Should score 2 points for the move
        const [p1Score] = game.getScores();
        expect(p1Score).toBe(2);
    });

    test("should handle multiple SOS formations in one move (SimpleGame - ends on first)", () => {
        const game = new SimpleGame(5, player1, player2);
        // Set up board for multiple SOS
        game.placeMove(2, 1, "S", 1); // P1
        game.placeMove(0, 0, "S", 2); // P2
        game.placeMove(2, 3, "S", 1); // P1
        game.placeMove(0, 1, "S", 2); // P2
        game.placeMove(1, 2, "S", 1); // P1
        game.placeMove(0, 2, "S", 2); // P2
        game.placeMove(3, 2, "S", 1); // P1

        // Place O in center to form multiple SOS patterns for Player 2
        game.placeMove(2, 2, "O", 2);

        // Even if multiple SOS are formed, only the first counts towards score and ends the game
        expect(game.getLastMoveScore()).toBeGreaterThan(0); // Should be 1 or more
        const [p1Score, p2Score] = game.getScores();
        expect(p1Score).toBe(0); // Player 1 didn't score on the last move
        expect(p2Score).toBe(game.getLastMoveScore()); // Player 2 scores
        expect(game.getGameOver()).toBe(true);
        expect(game.getWinner()).toBe(2);
    });
});

// Computer Player Tests
describe("Computer Player Logic", () => {
    let computerPlayer1: ComputerPlayer;
    let computerPlayer2: ComputerPlayer;
    let humanPlayer: HumanPlayer;
    jest.setTimeout(15000); // Set timeout for async tests

    beforeEach(() => {
        computerPlayer1 = new ComputerPlayer(1);
        humanPlayer = new HumanPlayer(2); // Human opponent
        computerPlayer2 = new ComputerPlayer(2); // Computer opponent
    });

    test("Computer should make a winning move (SimpleGame)", async () => {
        const game = new SimpleGame(3, computerPlayer1, humanPlayer);
        // Set up board: S _ S
        // Computer (P1) needs to place O at (0, 1) to win
        game.placeMove(0, 0, "S", 1); // Computer places S (simulated)
        game.placeMove(1, 0, "O", 2); // Human places O
        game.placeMove(0, 2, "S", 1); // Computer places S (simulated)
        game.placeMove(1, 1, "O", 2); // Human places O

        // Now it's computer's turn (P1)
        const move = await computerPlayer1.getMove(game);
        expect(move).toEqual({ row: 0, column: 1, letter: "O" });
    });

    test("Computer should make a winning move (GeneralGame)", async () => {
        const game = new GeneralGame(3, computerPlayer1, humanPlayer);
        // Set up board: S _ S
        // Computer (P1) needs to place O at (0, 1) to score
        game.placeMove(0, 0, "S", 1); // Computer places S (simulated)
        game.placeMove(1, 0, "O", 2); // Human places O
        game.placeMove(0, 2, "S", 1); // Computer places S (simulated)
        game.placeMove(1, 1, "O", 2); // Human places O

        // Now it's computer's turn (P1)
        const move = await computerPlayer1.getMove(game);
        expect(move).toEqual({ row: 0, column: 1, letter: "O" });
    });

    test("Computer should block opponent winning move (SimpleGame)", async () => {
        const game = new SimpleGame(3, humanPlayer, computerPlayer2); // Human is P1, Computer is P2
        // Set up board: S _ S (Human P1 made this)
        // Computer (P2) needs to block by placing something at (0, 1)
        game.placeMove(0, 0, "S", 1); // Human places S
        game.placeMove(1, 0, "O", 2); // Computer places O
        game.placeMove(0, 2, "S", 1); // Human places S

        // Now it's computer's turn (P2)
        const move = await computerPlayer2.getMove(game);
        // Computer should place *something* at (0, 1) to block
        expect(move.row).toBe(0);
        expect(move.column).toBe(1);
        // It might place S or O, either blocks effectively in this setup
        expect(["S", "O"]).toContain(move.letter);
    });

    test("Computer should block opponent winning move (GeneralGame)", async () => {
        const game = new GeneralGame(3, humanPlayer, computerPlayer2); // Human is P1, Computer is P2
        // Set up board: S _ S (Human P1 made this)
        // Computer (P2) needs to block by placing something at (0, 1)
        game.placeMove(0, 0, "S", 1); // Human places S
        game.placeMove(1, 0, "O", 2); // Computer places O
        game.placeMove(0, 2, "S", 1); // Human places S

        // Now it's computer's turn (P2)
        const move = await computerPlayer2.getMove(game);
        // Computer should place *something* at (0, 1) to block
        expect(move.row).toBe(0);
        expect(move.column).toBe(1);
        // It might place S or O, either blocks effectively in this setup
        expect(["S", "O"]).toContain(move.letter);
    });

    test("Computer should make a valid random move if no win/block", async () => {
        const game = new SimpleGame(3, computerPlayer1, computerPlayer2);
        // Empty board, no immediate win/block
        const move = await computerPlayer1.getMove(game);

        // Check if the move is valid (within bounds, on an empty cell)
        expect(move.row).toBeGreaterThanOrEqual(0);
        expect(move.row).toBeLessThan(3);
        expect(move.column).toBeGreaterThanOrEqual(0);
        expect(move.column).toBeLessThan(3);
        expect(["S", "O"]).toContain(move.letter);
        expect(game.getCell(move.row, move.column)).toBe(""); // Cell should be empty before move
    });

    test("Computer vs Computer game progresses (SimpleGame)", async () => {
        const game = new SimpleGame(3, computerPlayer1, computerPlayer2);
        let movesMade = 0;
        const maxMoves = 9 * 2; // Max possible moves (S or O for each cell)

        while (!game.getGameOver() && movesMade < maxMoves) {
            const currentPlayer =
                game.getCurrentPlayerObject() as ComputerPlayer;
            const move = await currentPlayer.getMove(game);
            const success = game.placeMove(
                move.row,
                move.column,
                move.letter,
                game.getCurrentPlayer()
            );
            expect(success).toBe(true); // Expect computer moves to be valid
            movesMade++;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }

        expect(game.getGameOver()).toBe(true);
        expect(movesMade).toBeGreaterThan(0); // Ensure some moves were made
    });

    test("Computer vs Computer game progresses (GeneralGame)", async () => {
        const game = new GeneralGame(3, computerPlayer1, computerPlayer2);
        let movesMade = 0;
        const maxMoves = 9; // Max possible moves

        while (!game.getGameOver() && movesMade < maxMoves) {
            const currentPlayer =
                game.getCurrentPlayerObject() as ComputerPlayer;
            const move = await currentPlayer.getMove(game);
            const success = game.placeMove(
                move.row,
                move.column,
                move.letter,
                game.getCurrentPlayer()
            );
            expect(success).toBe(true); // Expect computer moves to be valid
            movesMade++;
            // await new Promise((resolve) => setTimeout(resolve, 10));
        }

        expect(game.getGameOver()).toBe(true);
        expect(movesMade).toBeGreaterThan(0);
        const [p1Score, p2Score] = game.getScores();
        expect(p1Score + p2Score).toBeGreaterThanOrEqual(0); // Scores should be non-negative
    });
});
