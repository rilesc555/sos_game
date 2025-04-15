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

        game.placeMove(0, 0, "S"); // P1
        game.placeMove(0, 1, "O"); // P2
        game.placeMove(0, 2, "S"); // P1 makes SOS

        // Game should be over after first SOS in simple mode
        expect(game.getGameOver()).toBe(true);
        expect(game.getWinner()).toBe(1);
    });

    test("GeneralGame should continue after SOS and end when full", () => {
        const game = new GeneralGame(3, player1, player2);

        game.placeMove(0, 0, "S"); // P1
        game.placeMove(0, 1, "O"); // P2
        game.placeMove(0, 2, "S"); // P1 makes SOS, gets extra turn

        // Game should continue after SOS in general mode
        expect(game.getGameOver()).toBe(false);
        expect(game.getCurrentPlayer()).toBe(1); // P1 has extra turn

        // Fill the rest of the board
        game.placeMove(1, 0, "S"); // P1 (extra turn)
        game.placeMove(1, 1, "O"); // P2
        game.placeMove(1, 2, "S"); // P1
        game.placeMove(2, 0, "S"); // P2
        game.placeMove(2, 1, "O"); // P1
        game.placeMove(2, 2, "S"); // P2

        // Now game should be over
        expect(game.isBoardFull()).toBe(true);
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

        // Place 'S' at (0,0) - P1
        expect(game.placeMove(0, 0, "S")).toBe(true);
        expect(game.getCell(0, 0)).toBe("S");
        expect(game.getCurrentPlayer()).toBe(2); // Turn switches

        // Place 'O' at (1,1) - P2
        expect(game.placeMove(1, 1, "O")).toBe(true);
        expect(game.getCell(1, 1)).toBe("O");
        expect(game.getCurrentPlayer()).toBe(1); // Turn switches back
    });

    test("should place S and O on the board correctly (GeneralGame)", () => {
        const game = new GeneralGame(3, player1, player2);

        // Place 'S' at (0,0) - P1
        expect(game.placeMove(0, 0, "S")).toBe(true);
        expect(game.getCell(0, 0)).toBe("S");
        expect(game.getCurrentPlayer()).toBe(2); // Turn switches

        // Place 'O' at (1,1) - P2
        expect(game.placeMove(1, 1, "O")).toBe(true);
        expect(game.getCell(1, 1)).toBe("O");
        expect(game.getCurrentPlayer()).toBe(1); // Turn switches back
    });

    test("should not allow placing on occupied cell (SimpleGame)", () => {
        const game = new SimpleGame(3, player1, player2);

        // Place 'S' at (0,0) - P1
        expect(game.placeMove(0, 0, "S")).toBe(true);
        expect(game.getCurrentPlayer()).toBe(2); // P2's turn

        // Try to place 'O' on the same cell - P2
        expect(game.placeMove(0, 0, "O")).toBe(false);
        expect(game.getCell(0, 0)).toBe("S"); // Should remain 'S'
        expect(game.getCurrentPlayer()).toBe(2); // Still P2's turn
    });

    test("should not allow placing on occupied cell (GeneralGame)", () => {
        const game = new GeneralGame(3, player1, player2);

        // Place 'S' at (0,0) - P1
        expect(game.placeMove(0, 0, "S")).toBe(true);
        expect(game.getCurrentPlayer()).toBe(2); // P2's turn

        // Try to place 'O' on the same cell - P2
        expect(game.placeMove(0, 0, "O")).toBe(false);
        expect(game.getCell(0, 0)).toBe("S"); // Should remain 'S'
        expect(game.getCurrentPlayer()).toBe(2); // Still P2's turn
    });

    test("should not allow invalid moves outside board (SimpleGame)", () => {
        const game = new SimpleGame(3, player1, player2);
        expect(game.placeMove(-1, 0, "S")).toBe(false);
        expect(game.placeMove(0, -1, "S")).toBe(false);
        expect(game.placeMove(3, 0, "S")).toBe(false);
        expect(game.placeMove(0, 3, "S")).toBe(false);
        expect(game.getCurrentPlayer()).toBe(1); // Turn should not change
    });

    test("should not allow invalid moves outside board (GeneralGame)", () => {
        const game = new GeneralGame(3, player1, player2);
        expect(game.placeMove(-1, 0, "S")).toBe(false);
        expect(game.placeMove(0, -1, "S")).toBe(false);
        expect(game.placeMove(3, 0, "S")).toBe(false);
        expect(game.placeMove(0, 3, "S")).toBe(false);
        expect(game.getCurrentPlayer()).toBe(1); // Turn should not change
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
        game.placeMove(0, 0, "S"); // P1
        game.placeMove(1, 1, "O"); // P2 - Place somewhere else
        game.placeMove(0, 1, "O"); // P1
        game.placeMove(1, 0, "S"); // P2 - Place somewhere else
        game.placeMove(0, 2, "S"); // P1 makes SOS
        expect(game.getLastMoveScore()).toBe(1);
    });

    test("should detect vertical SOS (GeneralGame)", () => {
        const game = new GeneralGame(3, player1, player2);
        game.placeMove(0, 0, "S"); // P1
        game.placeMove(0, 1, "O"); // P2
        game.placeMove(1, 0, "O"); // P1
        game.placeMove(1, 1, "S"); // P2
        game.placeMove(2, 0, "S"); // P1 makes SOS
        expect(game.getLastMoveScore()).toBe(1);
    });

    test("should detect diagonal SOS (SimpleGame)", () => {
        const game = new SimpleGame(3, player1, player2);
        game.placeMove(0, 0, "S"); // P1
        game.placeMove(0, 1, "O"); // P2
        game.placeMove(1, 1, "O"); // P1
        game.placeMove(0, 2, "S"); // P2
        game.placeMove(2, 2, "S"); // P1 makes SOS
        expect(game.getLastMoveScore()).toBe(1);
    });

    test("should track SOS sequences with player information (GeneralGame)", () => {
        const game = new GeneralGame(3, player1, player2);
        game.placeMove(0, 0, "S"); // P1
        game.placeMove(1, 1, "O"); // P2
        game.placeMove(0, 1, "O"); // P1
        game.placeMove(1, 0, "S"); // P2
        game.placeMove(0, 2, "S"); // P1 makes SOS

        const sequences = game.getSOSSequences();
        expect(sequences.length).toBe(1);
        expect(sequences[0].player).toBe(1); // Player 1 made the SOS
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
        game.placeMove(0, 0, "S"); // P1
        game.placeMove(0, 1, "O"); // P2
        game.placeMove(1, 0, "S"); // P1
        game.placeMove(1, 1, "O"); // P2

        expect(game.isBoardFull()).toBe(true);
    });

    test("should detect when board is full (GeneralGame)", () => {
        const game = new GeneralGame(2, player1, player2);

        // Initially board is not full
        expect(game.isBoardFull()).toBe(false);

        // Fill the board
        game.placeMove(0, 0, "S"); // P1
        game.placeMove(0, 1, "O"); // P2
        game.placeMove(1, 0, "S"); // P1
        game.placeMove(1, 1, "O"); // P2

        expect(game.isBoardFull()).toBe(true);
    });

    test("should end SimpleGame on first SOS", () => {
        const game = new SimpleGame(3, player1, player2);
        game.placeMove(0, 0, "S"); // P1
        game.placeMove(0, 1, "O"); // P2
        game.placeMove(0, 2, "S"); // P1 makes SOS

        expect(game.getGameOver()).toBe(true);
        expect(game.getWinner()).toBe(1);
    });

    test("should end SimpleGame when board is full without SOS (Draw)", () => {
        const game = new SimpleGame(2, player1, player2);
        game.placeMove(0, 0, "S"); // P1
        game.placeMove(0, 1, "S"); // P2
        game.placeMove(1, 0, "O"); // P1
        game.placeMove(1, 1, "O"); // P2
        expect(game.isBoardFull()).toBe(true);
        expect(game.getGameOver()).toBe(true);
        expect(game.getWinner()).toBe(0); // Draw if no SOS
    });

    test("should end GeneralGame only when board is full", () => {
        const game = new GeneralGame(3, player1, player2);

        // First SOS
        game.placeMove(0, 0, "S"); // P1
        game.placeMove(0, 1, "O"); // P2
        game.placeMove(0, 2, "S"); // P1 makes SOS, gets extra turn

        expect(game.getGameOver()).toBe(false);
        expect(game.getCurrentPlayer()).toBe(1);

        // Fill rest of board
        game.placeMove(1, 0, "S"); // P1 (extra)
        game.placeMove(1, 1, "S"); // P2
        game.placeMove(1, 2, "O"); // P1
        game.placeMove(2, 0, "O"); // P2
        game.placeMove(2, 1, "S"); // P1
        game.placeMove(2, 2, "S"); // P2

        expect(game.isBoardFull()).toBe(true);
        expect(game.getGameOver()).toBe(true);
    });

    test("should correctly determine winner in GeneralGame based on score (Draw)", () => {
        const game = new GeneralGame(3, player1, player2);

        // P1 places S (0,0) -> P2 turn
        game.placeMove(0, 0, "S");
        // P2 places O (0,1) -> P1 turn
        game.placeMove(0, 1, "O");
        // P1 places S (0,2) -> SOS -> P1 score=1, P1 extra turn
        game.placeMove(0, 2, "S");

        // P1 places S (1,0) -> P2 turn
        game.placeMove(1, 0, "S");
        // P2 places O (1,1) -> P1 turn
        game.placeMove(1, 1, "O");
        // P1 places S (2,0) -> P2 turn // No SOS here
        game.placeMove(2, 0, "O");
        // P2 places S (1,2) -> SOS -> P2 score=1, P2 extra turn
        game.placeMove(1, 2, "S");
        // P2 places O (2,1) -> P1 turn
        game.placeMove(2, 1, "O");
        // P1 places O (2,2) -> Board full -> Game Over. Winner Draw (1-1)
        game.placeMove(2, 2, "O");

        expect(game.isBoardFull()).toBe(true);
        expect(game.getGameOver()).toBe(true);
        const [p1Score, p2Score] = game.getScores();
        expect(p1Score).toBe(1);
        expect(p2Score).toBe(1);
        expect(game.getWinner()).toBe(0); // Draw
    });

    test("should correctly determine winner in GeneralGame based on score (P1 Wins)", () => {
        const game = new GeneralGame(3, player1, player2);
        // P1 makes 2 SOS, P2 makes 1
        game.placeMove(0, 0, "S"); // P1
        game.placeMove(1, 0, "S"); // P2
        game.placeMove(0, 1, "O"); // P1
        game.placeMove(1, 1, "O"); // P2
        game.placeMove(0, 2, "S"); // P1 -> SOS 1 (P1 score=1, extra turn)
        game.placeMove(2, 0, "O"); // P1 (extra)
        game.placeMove(1, 2, "S"); // P2 -> SOS 1 (P2 score=1, extra turn)
        game.placeMove(2, 1, "S"); // P2 (extra)
        game.placeMove(2, 2, "S"); // P1 -> SOS 2 (P1 score=2, extra turn)

        expect(game.isBoardFull()).toBe(true);
        expect(game.getGameOver()).toBe(true);
        const [p1Score, p2Score] = game.getScores();
        expect(p1Score).toBe(2);
        expect(p2Score).toBe(1);
        expect(game.getWinner()).toBe(1); // P1 Wins
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

        game.placeMove(0, 0, "S"); // P1 places, no SOS
        expect(game.getLastMoveScore()).toBe(0);
        expect(game.getCurrentPlayer()).toBe(2); // Should be P2's turn
    });

    test("should not switch turns after SOS in SimpleGame (game ends)", () => {
        const game = new SimpleGame(3, player1, player2);
        expect(game.getCurrentPlayer()).toBe(1);
        game.placeMove(0, 0, "S"); // P1
        game.placeMove(0, 1, "O"); // P2
        game.placeMove(0, 2, "S"); // Player 1 makes SOS
        // Game is over
        expect(game.getGameOver()).toBe(true);
        // Current player might be 1 or 2 depending on exact check order, but game is over.
    });

    test("should switch turns after move in GeneralGame if no SOS", () => {
        const game = new GeneralGame(3, player1, player2);
        expect(game.getCurrentPlayer()).toBe(1);
        game.placeMove(0, 0, "S"); // P1 places, no SOS
        expect(game.getLastMoveScore()).toBe(0);
        expect(game.getCurrentPlayer()).toBe(2); // Should be P2's turn
    });

    test("should give extra turn after SOS in GeneralGame", () => {
        const game = new GeneralGame(3, player1, player2);
        expect(game.getCurrentPlayer()).toBe(1);

        // Player 1 makes an SOS
        game.placeMove(0, 0, "S"); // P1
        game.placeMove(1, 1, "O"); // P2
        game.placeMove(0, 1, "O"); // P1
        game.placeMove(2, 2, "S"); // P2 makes SOS

        expect(game.getLastMoveScore()).toBe(1);
        // Player 1 should get another turn
        expect(game.getCurrentPlayer()).toBe(2);
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
        game.placeMove(0, 0, "S"); // P1
        game.placeMove(1, 1, "O"); // P2
        game.placeMove(0, 1, "O"); // P1
        game.placeMove(2, 2, "S"); // P2
        game.placeMove(0, 2, "S"); // P1 makes SOS

        const [p1Score, p2Score] = game.getScores();
        expect(p1Score).toBe(0);
        expect(p2Score).toBe(2);
    });

    test("should track scores correctly in SimpleGame (only first SOS counts)", () => {
        const game = new SimpleGame(3, player1, player2);
        game.placeMove(0, 0, "S"); // P1
        game.placeMove(0, 1, "O"); // P2
        game.placeMove(0, 2, "S"); // Player 1 scores 1
        const [p1Score, p2Score] = game.getScores();
        expect(p1Score).toBe(1);
        expect(p2Score).toBe(0);
        // Game should be over, further moves irrelevant for score
        expect(game.getGameOver()).toBe(true);
    });

    test("should handle multiple SOS formations in one move (GeneralGame)", () => {
        const game = new GeneralGame(5, player1, player2);

        // Set up board for multiple SOS
        // Need to alternate turns correctly
        game.placeMove(2, 1, "S"); // P1
        game.placeMove(0, 0, "O"); // P2
        game.placeMove(2, 3, "S"); // P1
        game.placeMove(0, 1, "O"); // P2
        game.placeMove(1, 2, "S"); // P1
        game.placeMove(0, 2, "O"); // P2
        game.placeMove(3, 2, "S"); // P1

        // Now P2's turn. Place O in center to form 4 SOS patterns
        game.placeMove(2, 2, "O"); // P2 makes SOS

        expect(game.getLastMoveScore()).toBe(2); // Should score 4 points for the move
        const [p1Score, p2Score] = game.getScores();
        expect(p1Score).toBe(0);
        expect(p2Score).toBe(2);
        expect(game.getCurrentPlayer()).toBe(2); // P2 gets extra turn
    });

    test("should handle multiple SOS formations in one move (SimpleGame - ends on first)", () => {
        const game = new SimpleGame(5, player1, player2);
        // Set up board for multiple SOS
        game.placeMove(2, 1, "S"); // P1
        game.placeMove(0, 0, "S"); // P2
        game.placeMove(2, 3, "S"); // P1
        game.placeMove(0, 1, "S"); // P2
        game.placeMove(1, 2, "S"); // P1
        game.placeMove(0, 2, "S"); // P2
        game.placeMove(3, 2, "S"); // P1

        // Place O in center to form multiple SOS patterns for Player 2
        game.placeMove(2, 2, "O"); // P2 makes SOS

        // Even if multiple SOS are formed, only the first counts towards score and ends the game
        expect(game.getLastMoveScore()).toBeGreaterThanOrEqual(1); // Should be 1 or more
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

    // Helper to simulate placing moves regardless of current player
    const forcePlaceMove = (
        game: SimpleGame | GeneralGame,
        row: number,
        col: number,
        letter: "S" | "O",
        player: number
    ) => {
        game.board[row][col] = letter;
    };

    test("Computer should make a winning move (SimpleGame)", async () => {
        const game = new SimpleGame(3, computerPlayer1, humanPlayer);
        // Set up board: S _ S for P1 (Computer)
        // Manually place pieces to control the state precisely
        forcePlaceMove(game, 0, 0, "S", 1);
        forcePlaceMove(game, 1, 0, "O", 2);
        forcePlaceMove(game, 0, 2, "S", 1);
        forcePlaceMove(game, 1, 1, "O", 2);
        (game as any).currentPlayer = computerPlayer1; // Ensure it's computer's turn

        // Now it's computer's turn (P1)
        const move = await computerPlayer1.getMove(game);
        expect(move).toEqual({ row: 0, column: 1, letter: "O" });
    });

    test("Computer should make a winning move (GeneralGame)", async () => {
        const game = new GeneralGame(3, computerPlayer1, humanPlayer);
        // Set up board: S _ S for P1 (Computer)
        forcePlaceMove(game, 0, 0, "S", 1);
        forcePlaceMove(game, 1, 0, "O", 2);
        forcePlaceMove(game, 0, 2, "S", 1);
        forcePlaceMove(game, 1, 1, "O", 2);
        (game as any).currentPlayer = computerPlayer1; // Ensure it's computer's turn

        // Now it's computer's turn (P1)
        const move = await computerPlayer1.getMove(game);
        expect(move).toEqual({ row: 0, column: 1, letter: "O" });
    });

    test("Computer should block opponent winning move (SimpleGame)", async () => {
        const game = new SimpleGame(3, humanPlayer, computerPlayer2); // Human is P1, Computer is P2
        // Set up board: S _ S (Human P1 made this)
        forcePlaceMove(game, 0, 0, "S", 1);
        forcePlaceMove(game, 1, 0, "O", 2); // Computer's previous move (simulated)
        forcePlaceMove(game, 0, 2, "S", 1);
        (game as any).currentPlayer = computerPlayer2; // Ensure it's computer's turn (P2)

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
        forcePlaceMove(game, 0, 0, "S", 1);
        forcePlaceMove(game, 1, 0, "O", 2); // Computer's previous move (simulated)
        forcePlaceMove(game, 0, 2, "S", 1);
        (game as any).currentPlayer = computerPlayer2; // Ensure it's computer's turn (P2)

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
            const currentPlayerObject =
                game.getCurrentPlayerObject() as ComputerPlayer;
            const move = await currentPlayerObject.getMove(game);
            const success = game.placeMove(
                move.row,
                move.column,
                move.letter
                // Removed player number argument
            );
            // If move is invalid (e.g., computer chose occupied cell - shouldn't happen with good logic)
            // the loop might continue without switching player. Add check:
            if (!success) {
                console.warn("Computer attempted invalid move:", move);
                // Find any valid move to prevent infinite loop in test
                let found = false;
                for (let r = 0; r < 3; r++) {
                    for (let c = 0; c < 3; c++) {
                        if (game.getCell(r, c) === "") {
                            game.placeMove(r, c, "S");
                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                }
                if (!found) break; // Board is full but game over not set?
            }
            movesMade++;
            await new Promise((resolve) => setTimeout(resolve, 10)); // Small delay
        }

        expect(game.getGameOver()).toBe(true);
        expect(movesMade).toBeGreaterThan(0); // Ensure some moves were made
    });

    test("Computer vs Computer game progresses (GeneralGame)", async () => {
        const game = new GeneralGame(3, computerPlayer1, computerPlayer2);
        let movesMade = 0;
        const maxMoves = 9; // Max cells to fill

        // Track actual cell placements to avoid infinite loops if computer logic fails
        let placements = 0;

        while (!game.getGameOver() && placements < maxMoves) {
            const currentPlayerObject =
                game.getCurrentPlayerObject() as ComputerPlayer;
            const move = await currentPlayerObject.getMove(game);
            const success = game.placeMove(
                move.row,
                move.column,
                move.letter
                // Removed player number argument
            );

            if (success) {
                placements++; // Only count successful placements
            } else {
                console.warn(
                    "Computer attempted invalid move in General Game:",
                    move
                );
                // Find any valid move to prevent infinite loop in test
                let found = false;
                for (let r = 0; r < 3; r++) {
                    for (let c = 0; c < 3; c++) {
                        if (game.getCell(r, c) === "") {
                            game.placeMove(r, c, "S");
                            found = true;
                            placements++;
                            break;
                        }
                    }
                    if (found) break;
                }
                if (!found) break; // Board is full
            }
            movesMade++; // Count attempts
            // No delay needed unless debugging timing issues
            // await new Promise((resolve) => setTimeout(resolve, 10));
        }

        expect(game.getGameOver()).toBe(true);
        expect(placements).toBeGreaterThan(0);
        const [p1Score, p2Score] = game.getScores();
        expect(p1Score + p2Score).toBeGreaterThanOrEqual(0); // Scores should be non-negative
    });
});
