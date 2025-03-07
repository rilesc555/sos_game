import { SOSGame } from '../game/SOSGame';

describe('SOSGame', () => {
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

  test('should detect when board is full', () => {
    const game = new SOSGame(2, 'simple');
    
    // Initially board is not full
    expect(game.isBoardFull()).toBe(false);
    
    // Fill the board
    game.placeMove(0, 0, 'S', 1);
    game.placeMove(0, 1, 'O', 2);
    game.placeMove(1, 0, 'S', 1);
    
    // Not yet full
    expect(game.isBoardFull()).toBe(false);
    
    // Fill last cell
    game.placeMove(1, 1, 'O', 2);
    
    // Now board should be full
    expect(game.isBoardFull()).toBe(true);
  });
});