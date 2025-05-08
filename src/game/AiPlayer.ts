import { Move, Player } from "./Player";
import { GeneralGame } from "./GeneralGame";

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

    private boardToString(board: string[][]): string {
        return board
            .map((row) =>
                row.map((cell) => (cell === "" ? "_" : cell)).join(" ")
            )
            .join("\n");
    }

    async getMove(game: GeneralGame): Promise<Move> {
        const board = game.getBoard();
        const boardString = this.boardToString(board);
        const BOARD_SIZE = board.length;
        const prompt = `You are an expert SOS game player.\nThe game is played on a ${BOARD_SIZE}x${BOARD_SIZE} grid.\nThe goal is to form "SOS" sequences (horizontally, vertically, or diagonally).\nEach "SOS" formed scores a point. The player who forms an SOS gets another turn.\nIf no SOS is formed, play passes to the other player.\nThe game ends when the board is full. The player with the most SOS sequences wins.\n\nCurrent Board State:\n\n${boardString}\n\nYou can choose to place an 'S' or an 'O'.\nYour task is to choose the best possible move.\nConsider the following strategy:\n1.  **Complete an SOS:** If you can place your letter to form an "SOS", do it.\n2.  **Set up an SOS:** If you can place your letter to create an "S _ S" or "O _ O" pattern where you can complete an SOS on your next turn, prioritize that.\n3.  **Block Opponent:** If the opponent has a setup (e.g., "S _ S"), consider blocking it if you cannot make a better move.\n4.  **Strategic Placement:** Otherwise, place your letter in a way that maximizes future opportunities or limits the opponent.\n\nYou MUST choose an empty cell.\nProvide your move as a JSON object matching the specified schema, with the ROW following the R, the COLUMN following the C, and the LETTER following the L.\nInclude a brief reasoning for your move.`;
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
