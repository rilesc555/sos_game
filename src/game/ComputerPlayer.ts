import { Move, Player } from "./Player";
import { SOSGame } from "./SOSGame";
import { GeneralGame } from "./GeneralGame";

export class ComputerPlayer extends Player {
    constructor(playerNumber: number) {
        super(playerNumber);
    }

    async getMove(game: SOSGame): Promise<Move> {
        // Add a longer delay for computer moves in general game mode
        const delay = game instanceof GeneralGame ? 1500 : 500;
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Get all available moves
        const availableMoves: Move[] = this.getAvailableMoves(game);

        // Try to find a winning move (completing an SOS)
        const winningMove = this.findWinningMove(game, availableMoves);
        if (winningMove) {
            return winningMove;
        }

        // Try to block opponent's winning move
        const blockingMove = this.findBlockingMove(game, availableMoves);
        if (blockingMove) {
            return blockingMove;
        }

        // If no strategic moves, make a random move
        const randomMove: Move =
            availableMoves[Math.floor(Math.random() * availableMoves.length)];

        return randomMove;
    }

    private getAvailableMoves(game: SOSGame): Move[] {
        const moves: Move[] = [];
        const board = game.getBoard();

        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] === "") {
                    const oMove: Move = { row: row, column: col, letter: "O" };
                    const sMove: Move = { row: row, column: col, letter: "S" };
                    moves.push(oMove);
                    moves.push(sMove);
                }
            }
        }
        return moves;
    }

    private findWinningMove(game: SOSGame, moves: Move[]): Move | null {
        for (const move of moves) {
            const gameCopy = game.clone();
            if (gameCopy.placeMove(move.row, move.column, move.letter)) {
                if (gameCopy.getLastMoveScore() > 0) {
                    return move;
                }
            }
        }
        return null;
    }

    private findBlockingMove(game: SOSGame, moves: Move[]): Move | null {
        const opponentNumber = this.playerNumber === 1 ? 2 : 1;

        for (const move of moves) {
            const gameCopy = game.clone();
            if (gameCopy.placeMove(move.row, move.column, move.letter)) {
                if (gameCopy.getLastMoveScore() > 0) {
                    return move;
                }
            }
        }
        return null;
    }
}
