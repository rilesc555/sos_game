import { Move, Player } from "./Player";
import { SOSGame } from "./SOSGame";
import { GeneralGame } from "./GeneralGame";
import { GoogleGenAI, Type } from "@google/genai";

type aiResponse = {
    row: string;
    column: string;
    letter: string;
};

export class AiPlayer extends Player {
    private genAI: GoogleGenAI;

    constructor(playerNumber: number) {
        super(playerNumber);
        this.genAI = new GoogleGenAI({
            apiKey: process.env.GENAI_API_KEY,
        });
    }

    public createEnumofPossibleRows(board: string[][]): string[] {
        const rows: string[] = [];
        for (let i = 0; i < board.length; i++) {
            rows.push(i.toString());
        }
        return rows;
    }

    public parseMove(response: aiResponse): Move {
        const row = parseInt(response.row);
        const column = parseInt(response.column);
        const letter = response.letter.toUpperCase();

        if (isNaN(row) || isNaN(column) || !["S", "O"].includes(letter)) {
            throw new Error("Invalid move");
        }

        return { row, column, letter };
    }

    async getMove(game: GeneralGame): Promise<Move> {
        const board = game.getBoard();
        const prompt = `You are a player in a game of SOS. The current board is as follows:\n${board}\nYour move (row, column, letter):`;
        const response = await this.genAI.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        'row': {
                            type: Type.STRING,
                            nullable: false,
                            enum: this.createEnumofPossibleRows(board),
                        },
                        'column': {
                            type: Type.STRING,
                            nullable: false,
                            enum: this.createEnumofPossibleRows(board),
                        },
                        'letter': {
                            type: Type.STRING,
                            nullable: false,
                            enum: ["S", "O"],
                        },
                    },
                    required: ['row', 'column', 'letter'],
                },
            },
        });
        const debugResponse = response.toString();

        return this.parseMove(JSON.parse(debugResponse));
    }
}
