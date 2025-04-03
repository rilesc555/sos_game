import { Player } from "./Player";
import { SOSGame } from "./SOSGame";

export class HumanPlayer extends Player {
    constructor(playerNumber: number) {
        super(playerNumber);
    }

    async makeMove(game: SOSGame): Promise<{row: number, col: number, letter: string}> {
        // Human moves are handled by the UI
        return new Promise(() => {});
    }

    getType(): 'human' | 'computer' {
        return 'human';
    }

    getPlayerNumber(): number {
        return this.playerNumber;
    }
} 