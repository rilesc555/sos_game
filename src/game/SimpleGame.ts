export class SimpleGame extends SOSGame {
  constructor(boardSize: number) {
    super(boardSize, "Simple");
  }

  public placeMove(
    row: number,
    col: number,
    letter: string,
    player: number
  ): boolean {
    if (this.gameOver) {
      return false;
    }

    if (row < 0 || row >= this.boardSize || col < 0 || col >= this.boardSize) {
      return false;
    }

    if (this.board[row][col] !== "") {
      return false;
    }

    if (letter !== "S" && letter !== "O") {
      return false;
    }

    this.board[row][col] = letter;
    this.sosMessageShown = false;

    // Check for SOS formations and update score
    this.lastMoveScore = this.checkSOS(row, col);
    if (this.lastMoveScore) {
      this.playerScores[player - 1] += this.lastMoveScore;
      this.gameOver = true;
      return true;
    }

    // Update current player only if no SOS was formed
    this.currentPlayer = player === 1 ? 2 : 1;

    // Check if game is over
    if (this.isBoardFull()) {
      this.gameOver = true;
      return true;
    }
    return true;
  }
  
  // Check if the game is over
  public isGameOver(): boolean {
      return this.gameOver || this.isBoardFull();
  }

  public clone(): SimpleGame {
    const newGame = new SimpleGame(this.boardSize);
    newGame.board = this.board.map((row) => [...row]);
    newGame.currentPlayer = this.currentPlayer;
    newGame.playerScores = [...this.playerScores];
    newGame.lastMoveScore = this.lastMoveScore;
    newGame.gameOver = this.gameOver;
    newGame.sosSequences = this.sosSequences.map(seq => ({...seq}));
    return newGame;
  }
}
