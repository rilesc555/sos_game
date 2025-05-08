import { NextRequest, NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { Move } from "game/Player";

const gemini_key = process.env.GEMINI_API_KEY;

if (!gemini_key) {
    console.log("GEMINI_KEY is not defined in environment variables");
}

const google = createGoogleGenerativeAI({
    apiKey: gemini_key!,
});

export async function POST(req: NextRequest) {
    try {
        const { prompt, board } = await req.json();

        // Find all empty cells and make a list of move strings of format R{row}C{column}L{letter}
        const possibleMoves: string[] = [];
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] === "") {
                    // Check if the cell is empty
                    possibleMoves.push(`R${row}C${col}LO`);
                    possibleMoves.push(`R${row}C${col}LS`);
                }
            }
        }

        console.log("Empty cells:", possibleMoves);

        if (possibleMoves.length === 0) {
            return NextResponse.json(
                { error: "No available moves." },
                { status: 400 }
            );
        }

        // Add a system prompt to reinforce the rule
        const systemPrompt =
            "You must only select an empty cell for your move. Do not pick a cell that is already filled. Play aggresively--trying to setup the other player to lose.";

        const result = await generateObject({
            model: google("gemini-2.0-flash"),
            output: "enum",
            enum: possibleMoves,
            prompt: `${systemPrompt}\n${prompt}`,
        });

        if ("error" in result) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        // No need to double-check, schema enforces only valid moves
        return NextResponse.json({ result: result.object });
    } catch (error: unknown) {
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
