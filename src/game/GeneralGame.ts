import { SOSGame } from "./SOSGame";
export class GeneralGame extends SOSGame {
    constructor(boardSize: number) {
        super(boardSize, "general");
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
        if (this.lastMoveScore) {
            this.playerScores[player - 1] += this.lastMoveScore;
        } else {
            if (this.isBoardFull()) {
                this.gameOver = true;
            }
            else {this.currentPlayer = player === 1 ? 2 : 1;}
        }
        return true;
    }

    public isGameOver(): boolean {
        return this.isBoardFull();
    }

    // Clone the current game state
    public clone(): GeneralGame {
        const newGame = new GeneralGame(this.boardSize);
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
