import { Player, Move } from "./Player";
import { SOSGame } from "./SOSGame";

export class HumanPlayer extends Player {
    public getType(): "human" | "computer" | "ai" {
        return "human";
    }

    getMove(game: SOSGame): Promise<Move> {
        throw new Error("Method not implemented.");
    }
    constructor(playerNumber: number) {
        super(playerNumber);
    }

    getIsHuman(): "human" | "computer" {
        return "human";
    }

    getPlayerNumber(): number {
        return this.playerNumber;
    }
}
