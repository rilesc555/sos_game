import { expect, test, describe } from "bun:test";

import { SOSGame } from '../game/SOSGame';

describe('SOSGame', () => {
  // Board Initialization Tests
  describe('Board Initialization', () => {
    test('should initialize with empty board of correct size', () => {
      const game = new SOSGame(6, 'simple');
      const board = game.getBoard();
      
      expect(board.length).toBe(6);
      expect(board[0].length).toBe(6);
      
      // All cells should be empty
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
          expect(game.getCell(row, col)).toBe('');
        }
      }
    });

    test('should allow board sizes between 3x3 and 12x12', () => {
      // Test minimum size
      const minGame = new SOSGame(3, 'simple');
      expect(minGame.getBoard().length).toBe(3);

      // Test maximum size
      const maxGame = new SOSGame(12, 'simple');
      expect(maxGame.getBoard().length).toBe(12);
    });
  });

  // Game Mode Tests
  describe('Game Modes', () => {
    test('should support simple game mode', () => {
      const game = new SOSGame(3, 'simple');
      
      // Make an SOS
      game.placeMove(0, 0, 'S', 1);
      game.placeMove(0, 1, 'O', 2);
      game.placeMove(0, 2, 'S', 1);

      // Game should be over after first SOS in simple mode
      expect(game.getGameOver()).toBe(true);
      expect(game.getWinner()).toBe(1);
    });

    test('should support general game mode', () => {
      const game = new SOSGame(3, 'general');
      
      // Make an SOS
      game.placeMove(0, 0, 'S', 1);
      game.placeMove(0, 1, 'O', 2);
      game.placeMove(0, 2, 'S', 1);

      // Game should continue after SOS in general mode
      expect(game.getGameOver()).toBe(false);

      // Fill the rest of the board
      game.placeMove(1, 0, 'S', 2);
      game.placeMove(1, 1, 'O', 1);
      game.placeMove(1, 2, 'S', 2);
      game.placeMove(2, 0, 'S', 1);
      game.placeMove(2, 1, 'O', 2);
      game.placeMove(2, 2, 'S', 1);

      // Now game should be over
      expect(game.getGameOver()).toBe(true);
    });
  });

  // Move Placement Tests
  describe('Move Placement', () => {
    test('should place S and O on the board correctly', () => {
      const game = new SOSGame(3, 'simple');
      
      // Place 'S' at (0,0)
      expect(game.placeMove(0, 0, 'S', 1)).toBe(true);
      expect(game.getCell(0, 0)).toBe('S');
      
      // Place 'O' at (1,1)
      expect(game.placeMove(1, 1, 'O', 2)).toBe(true);
      expect(game.getCell(1, 1)).toBe('O');
    });

    test('should not allow placing on occupied cell', () => {
      const game = new SOSGame(3, 'simple');
      
      // Place 'S' at (0,0)
      expect(game.placeMove(0, 0, 'S', 1)).toBe(true);
      
      // Try to place 'O' on the same cell
      expect(game.placeMove(0, 0, 'O', 2)).toBe(false);
      expect(game.getCell(0, 0)).toBe('S'); // Should remain 'S'
    });

    test('should not allow invalid moves outside board', () => {
      const game = new SOSGame(3, 'simple');
      expect(game.placeMove(-1, 0, 'S', 1)).toBe(false);
      expect(game.placeMove(0, -1, 'S', 1)).toBe(false);
      expect(game.placeMove(3, 0, 'S', 1)).toBe(false);
      expect(game.placeMove(0, 3, 'S', 1)).toBe(false);
    });
  });

  // SOS Detection Tests
  describe('SOS Detection', () => {
    test('should detect horizontal SOS', () => {
      const game = new SOSGame(3, 'simple');
      game.placeMove(0, 0, 'S', 1);
      game.placeMove(0, 1, 'O', 1);
      game.placeMove(0, 2, 'S', 1);
      expect(game.getLastMoveScore()).toBe(1);
    });

    test('should detect vertical SOS', () => {
      const game = new SOSGame(3, 'simple');
      game.placeMove(0, 0, 'S', 1);
      game.placeMove(1, 0, 'O', 1);
      game.placeMove(2, 0, 'S', 1);
      expect(game.getLastMoveScore()).toBe(1);
    });

    test('should detect diagonal SOS', () => {
      const game = new SOSGame(3, 'simple');
      game.placeMove(0, 0, 'S', 1);
      game.placeMove(1, 1, 'O', 1);
      game.placeMove(2, 2, 'S', 1);
      expect(game.getLastMoveScore()).toBe(1);
    });

    test('should track SOS sequences with player information', () => {
      const game = new SOSGame(3, 'general');
      game.placeMove(0, 0, 'S', 1);
      game.placeMove(0, 1, 'O', 2);
      game.placeMove(0, 2, 'S', 1);

      const sequences = game.getSOSSequences();
      expect(sequences.length).toBe(1);
      expect(sequences[0].player).toBe(1);
      expect(sequences[0].start).toEqual([0, 0]);
      expect(sequences[0].end).toEqual([0, 2]);
    });
  });

  // Game Over Conditions Tests
  describe('Game Over Conditions', () => {
    test('should detect when board is full', () => {
      const game = new SOSGame(2, 'simple');
      
      // Initially board is not full
      expect(game.isBoardFull()).toBe(false);
      
      // Fill the board
      game.placeMove(0, 0, 'S', 1);
      game.placeMove(0, 1, 'O', 2);
      game.placeMove(1, 0, 'S', 1);
      game.placeMove(1, 1, 'O', 2);
      
      expect(game.isBoardFull()).toBe(true);
    });

    test('should end simple game on first SOS', () => {
      const game = new SOSGame(3, 'simple');
      game.placeMove(0, 0, 'S', 1);
      game.placeMove(0, 1, 'O', 2);
      game.placeMove(0, 2, 'S', 1);
      
      expect(game.getGameOver()).toBe(true);
      expect(game.getWinner()).toBe(1);
    });

    test('should continue general game after SOS until board full', () => {
      const game = new SOSGame(3, 'general');
      
      // First SOS
      game.placeMove(0, 0, 'S', 1);
      game.placeMove(0, 1, 'O', 2);
      game.placeMove(0, 2, 'S', 1);
      
      expect(game.getGameOver()).toBe(false);
      
      // Fill rest of board
      game.placeMove(1, 0, 'S', 2);
      game.placeMove(1, 1, 'S', 1);
      game.placeMove(1, 2, 'O', 2);
      game.placeMove(2, 0, 'O', 1);
      game.placeMove(2, 1, 'S', 2);
      game.placeMove(2, 2, 'S', 1);
      
      expect(game.getGameOver()).toBe(true);
    });

    test('should correctly determine winner in general game', () => {
      const game = new SOSGame(3, 'general');
      
      // Player 1 makes an SOS
      game.placeMove(0, 0, 'S', 1);
      game.placeMove(0, 1, 'O', 1);
      game.placeMove(0, 2, 'S', 1);
      
      // Player 2 makes an SOS
      game.placeMove(1, 0, 'S', 2);
      game.placeMove(1, 1, 'O', 2);
      game.placeMove(1, 2, 'S', 2);
      
      // Fill rest of board without SOS
      game.placeMove(2, 0, 'O', 1);
      game.placeMove(2, 1, 'O', 2);
      game.placeMove(2, 2, 'O', 1);
      
      expect(game.getGameOver()).toBe(true);
      expect(game.getWinner()).toBe(0); // Draw
    });
  });

  // Turn Management Tests
  describe('Turn Management', () => {
    test('should switch turns after move in simple mode', () => {
      const game = new SOSGame(3, 'simple');
      expect(game.getCurrentPlayer()).toBe(1);
      
      game.placeMove(0, 0, 'S', 1);
      expect(game.getCurrentPlayer()).toBe(2);
    });

    test('should give extra turn after SOS in general mode', () => {
      const game = new SOSGame(3, 'general');
      expect(game.getCurrentPlayer()).toBe(1);
      
      // Player 1 makes an SOS
      game.placeMove(0, 0, 'S', 1);
      game.placeMove(0, 1, 'O', 1);
      game.placeMove(0, 2, 'S', 1);
      
      // Player 1 should get another turn
      expect(game.getCurrentPlayer()).toBe(1);
    });
  });

  // Score Tracking Tests
  describe('Score Tracking', () => {
    test('should track scores correctly', () => {
      const game = new SOSGame(3, 'general');
      
      // Player 1 makes an SOS
      game.placeMove(0, 0, 'S', 1);
      game.placeMove(0, 1, 'O', 1);
      game.placeMove(0, 2, 'S', 1);
      
      const [p1Score, p2Score] = game.getScores();
      expect(p1Score).toBe(1);
      expect(p2Score).toBe(0);
    });

    test('should handle multiple SOS formations in one move', () => {
      const game = new SOSGame(5, 'general');
      
      // Set up board for multiple SOS
      game.placeMove(2, 1, 'S', 1);
      game.placeMove(2, 3, 'S', 1);
      game.placeMove(1, 2, 'S', 1);
      game.placeMove(3, 2, 'S', 1);
      
      // Place O in center to form 4 SOS patterns
      game.placeMove(2, 2, 'O', 1);
      
      expect(game.getLastMoveScore()).toBe(4);
      const [p1Score] = game.getScores();
      expect(p1Score).toBe(4);
    });
  });
});