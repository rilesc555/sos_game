export abstract class SOSGame {
    protected board: string[][];
    protected boardSize: number;
    protected gameMode: string;
    protected currentPlayer: number;
    protected playerScores: [number, number];
    protected lastMoveScore: number;
    protected gameOver: boolean;
    protected sosSequences: {
        start: [number, number];
        end: [number, number];
        player: number;
    }[];
    protected sosMessageShown: boolean;

    constructor(boardSize: number, gameMode: string) {
        this.boardSize = boardSize;
        this.gameMode = gameMode;
        this.currentPlayer = 1;
        this.playerScores = [0, 0];
        this.lastMoveScore = 0;
        this.gameOver = false;
        this.sosSequences = [];
        this.sosMessageShown = false;

        // Initialize the empty board
        this.board = Array(boardSize)
            .fill(null)
            .map(() => Array(boardSize).fill(""));
    }

    abstract placeMove(
        row: number,
        col: number,
        letter: string,
        player: number
    ): boolean;

    abstract isGameOver(): boolean;

    abstract clone(): SOSGame;

    // Get the current state of the board
    public getBoard(): string[][] {
        return this.board;
    }

    // Get a specific cell value
    public getCell(row: number, col: number): string {
        if (
            row < 0 ||
            row >= this.boardSize ||
            col < 0 ||
            col >= this.boardSize
        ) {
            throw new Error("Cell position out of bounds");
        }
        return this.board[row][col];
    }

    public checkSOS(row: number, col: number): number {
        const letter = this.board[row][col];
        let sosCount = 0;

        // Define all possible directions to check
        const directions = [
            [0, 1], // horizontal
            [1, 0], // vertical
            [1, 1], // diagonal down-right
            [1, -1], // diagonal down-left
        ];
        // For each direction, check if the placed letter forms part of an SOS
        for (const [dr, dc] of directions) {
            if (letter === "S") {
                // Check if S is the start of SOS (look forward)
                if (
                    row + 2 * dr >= 0 &&
                    row + 2 * dr < this.boardSize &&
                    col + 2 * dc >= 0 &&
                    col + 2 * dc < this.boardSize
                ) {
                    if (
                        this.board[row + dr][col + dc] === "O" &&
                        this.board[row + 2 * dr][col + 2 * dc] === "S"
                    ) {
                        sosCount++;
                        this.sosSequences.push({
                            start: [row, col],
                            end: [row + 2 * dr, col + 2 * dc],
                            player: this.currentPlayer,
                        });
                    }
                }

                // Check if S is the end of SOS (look backward)
                if (
                    row - 2 * dr >= 0 &&
                    row - 2 * dr < this.boardSize &&
                    col - 2 * dc >= 0 &&
                    col - 2 * dc < this.boardSize
                ) {
                    if (
                        this.board[row - dr][col - dc] === "O" &&
                        this.board[row - 2 * dr][col - 2 * dc] === "S"
                    ) {
                        sosCount++;
                        this.sosSequences.push({
                            start: [row - 2 * dr, col - 2 * dc],
                            end: [row, col],
                            player: this.currentPlayer,
                        });
                    }
                }
            } else if (letter === "O") {
                // Check if O is in the middle of SOS
                if (
                    row - dr >= 0 &&
                    row - dr < this.boardSize &&
                    col - dc >= 0 &&
                    col - dc < this.boardSize &&
                    row + dr >= 0 &&
                    row + dr < this.boardSize &&
                    col + dc >= 0 &&
                    col + dc < this.boardSize
                ) {
                    if (
                        this.board[row - dr][col - dc] === "S" &&
                        this.board[row + dr][col + dc] === "S"
                    ) {
                        sosCount++;
                        this.sosSequences.push({
                            start: [row - dr, col - dc],
                            end: [row + dr, col + dc],
                            player: this.currentPlayer,
                        });
                    }
                }
            }
        }

        return sosCount;
    }

    // Check if the board is full
    public isBoardFull(): boolean {
        return this.board.every((row) => row.every((cell) => cell !== ""));
    }

    // Get the winner (0 for draw, 1 for player 1, 2 for player 2)
    public getWinner(): number {
        if (!this.gameOver && !this.isGameOver()) {
            return 0; // Game not finished yet
        }

        if (this.playerScores[0] > this.playerScores[1]) {
            return 1;
        } else if (this.playerScores[1] > this.playerScores[0]) {
            return 2;
        } else {
            return 0; // Draw
        }
    }

    // Get the current scores
    public getScores(): [number, number] {
        return this.playerScores;
    }

    // Get the current player
    public getCurrentPlayer(): number {
        return this.currentPlayer;
    }

    // Get the score from the last move
    public getLastMoveScore(): number {
        return this.lastMoveScore;
    }

    // Check if the game is over
    public getGameOver(): boolean {
        return this.gameOver;
    }

    // Get SOS sequences
    public getSOSSequences(): {
        start: [number, number];
        end: [number, number];
        player: number;
    }[] {
        return this.sosSequences;
    }

    // Check if SOS message has been shown for the current move
    public isSosMessageShown(): boolean {
        return this.sosMessageShown;
    }

    // Mark SOS message as shown
    public setSosMessageShown(): void {
        this.sosMessageShown = true;
    }
}
