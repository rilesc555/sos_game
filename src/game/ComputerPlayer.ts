import { Player } from "./Player";
import { SOSGame } from "./SOSGame";

export class ComputerPlayer extends Player {
    constructor(playerNumber: number) {
        super(playerNumber);
    }

    async makeMove(game: SOSGame): Promise<{row: number, col: number, letter: string}> {
        // Get all available moves
        const availableMoves = this.getAvailableMoves(game);
        
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
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        
        // Add artificial delay to make it feel more natural
        await new Promise(resolve => setTimeout(resolve, 1000));
        return randomMove;
    }

    private getAvailableMoves(game: SOSGame): {row: number, col: number, letter: string}[] {
        const moves: {row: number, col: number, letter: string}[] = [];
        const board = game.getBoard();
        
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] === '') {
                    moves.push({row, col, letter: 'S'});
                    moves.push({row, col, letter: 'O'});
                }
            }
        }
        return moves;
    }

    private findWinningMove(game: SOSGame, moves: {row: number, col: number, letter: string}[]): {row: number, col: number, letter: string} | null {
        for (const move of moves) {
            const gameCopy = game.clone();
            if (gameCopy.placeMove(move.row, move.col, move.letter, this.playerNumber)) {
                if (gameCopy.getLastMoveScore() > 0) {
                    return move;
                }
            }
        }
        return null;
    }

    private findBlockingMove(game: SOSGame, moves: {row: number, col: number, letter: string}[]): {row: number, col: number, letter: string} | null {
        const opponentNumber = this.playerNumber === 1 ? 2 : 1;
        
        for (const move of moves) {
            const gameCopy = game.clone();
            if (gameCopy.placeMove(move.row, move.col, move.letter, opponentNumber)) {
                if (gameCopy.getLastMoveScore() > 0) {
                    return move;
                }
            }
        }
        return null;
    }
} 