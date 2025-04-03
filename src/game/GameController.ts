import { SOSGame } from "./SOSGame";

export class GameController {
    private game: SOSGame;
    private isGameRunning: boolean = false;

    constructor(game: SOSGame) {
        this.game = game;
    }

    async startGame() {
        this.isGameRunning = true;
        while (this.isGameRunning && !this.game.isGameOver()) {
            const currentPlayer = this.game.getCurrentPlayerObject();
            
            if (currentPlayer.getType() === 'computer') {
                const move = await currentPlayer.makeMove(this.game);
                this.game.placeMove(move.row, move.col, move.letter, currentPlayer.getPlayerNumber());
            }
            
            // Human moves will be handled by the UI
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    stopGame() {
        this.isGameRunning = false;
    }
} 