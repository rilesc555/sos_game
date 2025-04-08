import { Player, Move } from "./Player";
import { SOSGame } from "./SOSGame";

export class HumanPlayer extends Player {
    constructor(playerNumber: number) {
        super(playerNumber);
    }

    async getMove(game: SOSGame): Promise<Move> {
        // Human moves are handled by the UI
        return new Promise(() => {});
    }

    getType(): "human" | "computer" {
        return "human";
    }

    getPlayerNumber(): number {
        return this.playerNumber;
    }
}
