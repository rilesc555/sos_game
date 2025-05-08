import { Move, Player } from "./Player";
import { GeneralGame } from "./GeneralGame";

type aiResponse = {
    row: string;
    column: string;
    letter: string;
};

export class AiPlayer extends Player {
    constructor(playerNumber: number) {
        super(playerNumber);
    }

    public getType(): "human" | "computer" | "ai" {
        return "ai";
    }

    public createEnumofPossibleRows(board: string[][]): string[] {
        const rows: string[] = [];
        for (let i = 0; i < board.length; i++) {
            rows.push(i.toString());
        }
        return rows;
    }

    // convert the response to a Move object
    // response is a string of the format "R{row: int}C{column: int}L{S | O}"
    public parseMove(response: string): Move {
        const regex = /R(\d+)C(\d+)L([SO])/;
        const match = response.match(regex);
        if (!match) {
            throw new Error("Invalid move format");
        }

        const row = parseInt(match[1]);
        const column = parseInt(match[2]);
        const letter = match[3] as "S" | "O";

        return { row, column, letter };
    }

    async getMove(game: GeneralGame): Promise<Move> {
        const board = game.getBoard();
        const board_length = board.length;
        const prompt = `You are a player in a game of SOS. The goal is to form the word "SOS" on the board. You can place an "S" or an "O" in an empty cell. The size of the current board is ${board_length} The current board is as follows:\n${board}\n. Your move (row, column, letter):`;
        const response = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt,
                board,
            }),
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                `AI API Error: ${data.error || response.statusText}`
            );
        }

        if (!data.result) {
            throw new Error("AI API did not return a valid response");
        }

        // data.result is already an object of type aiResponse
        return this.parseMove(data.result);
    }
}
