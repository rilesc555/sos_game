import { HumanPlayer } from "./HumanPlayer";
import { ComputerPlayer } from "./ComputerPlayer";
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

    public getType(): "human" | "computer" | "ai" {
        if (this instanceof HumanPlayer) {
            return "human";
        } else if (this instanceof ComputerPlayer) {
            return "computer";
        } else {
            return "ai";
        }
    }

    public getPlayerNumber(): number {
        return this.playerNumber;
    }
}
