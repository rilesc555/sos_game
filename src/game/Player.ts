import { HumanPlayer } from "./HumanPlayer";
import { SOSGame } from "./SOSGame";

export abstract class Player {
    protected playerNumber: number;

    constructor(playerNumber: number) {
        this.playerNumber = playerNumber;
    }

    abstract makeMove(game: SOSGame): Promise<{row: number, col: number, letter: string}>;
    
    getType(): 'human' | 'computer' {
        return this instanceof HumanPlayer ? 'human' : 'computer';
    }

    getPlayerNumber(): number {
        return this.playerNumber;
    }
} 