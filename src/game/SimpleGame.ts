import { SOSGame } from "./SOSGame";
import { Player } from "./Player";

export class SimpleGame extends SOSGame {
    constructor(boardSize: number, player1: Player, player2: Player) {
        super(boardSize, "simple", player1, player2);
    }

    public placeMove(row: number, col: number, letter: string): boolean {
        if (this.gameOver) {
            return false;
        }

        if (
            row < 0 ||
            row >= this.boardSize ||
            col < 0 ||
            col >= this.boardSize
        ) {
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
        this.playerScores[this.currentPlayer - 1] += this.lastMoveScore;

        this.gameOver = this.isGameOver();

        if (this.gameOver) {
            return true;
        } else {
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
            return true;
        }
    }

    // Check if the game is over
    protected isGameOver(): boolean {
        return this.lastMoveScore !== 0 || this.isBoardFull();
    }

    public clone(): SimpleGame {
        const newGame = new SimpleGame(
            this.boardSize,
            this.players[0],
            this.players[1]
        );
        newGame.board = this.board.map((row) => [...row]);
        newGame.currentPlayer = this.currentPlayer;
        newGame.playerScores = [...this.playerScores];
        newGame.lastMoveScore = this.lastMoveScore;
        newGame.gameOver = this.gameOver;
        newGame.sosSequences = this.sosSequences.map((seq) => ({ ...seq }));
        newGame.sosMessageShown = this.sosMessageShown;
        return newGame;
    }
}
