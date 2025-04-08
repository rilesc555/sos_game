import { HumanPlayer } from "./HumanPlayer";
import { SOSGame } from "./SOSGame";

export type Move = {
    row: number;
    column: number;
    letter: string;
};

export abstract class Player {
    protected playerNumber: number;

    constructor(playerNumber: number) {
        this.playerNumber = playerNumber;
    }

    abstract getMove(game: SOSGame): Promise<Move>;

    getType(): "human" | "computer" {
        return this instanceof HumanPlayer ? "human" : "computer";
    }

    getPlayerNumber(): number {
        return this.playerNumber;
    }
}
