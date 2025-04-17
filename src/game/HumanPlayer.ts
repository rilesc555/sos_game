import { Player, Move } from "./Player";
import { SOSGame } from "./SOSGame";

export class HumanPlayer extends Player {
    getMove(game: SOSGame): Promise<Move> {
        throw new Error("Method not implemented.");
    }
    constructor(playerNumber: number) {
        super(playerNumber);
    }

    getType(): "human" | "computer" {
        return "human";
    }

    getPlayerNumber(): number {
        return this.playerNumber;
    }
}
