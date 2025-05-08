import { NextRequest, NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI, openai } from "@ai-sdk/openai";
import { generateObject } from "ai";

const gemini_key = process.env.GEMINI_API_KEY;
const openai_key = process.env.OPENAI_API_KEY;
if (!openai_key) {
    console.log("OPENAI_API_KEY is not defined in environment variables");
}

if (!gemini_key) {
    console.log("GEMINI_KEY is not defined in environment variables");
}

const google = createGoogleGenerativeAI({
    apiKey: gemini_key!,
});
const openaiClient = createOpenAI({
    apiKey: openai_key!,
});

export async function POST(req: NextRequest) {
    try {
        const { prompt, board } = await req.json();

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

        if (possibleMoves.length === 0) {
            return NextResponse.json(
                { error: "No available moves." },
                { status: 400 }
            );
        }

        const result = await generateObject({
            model: openai("gpt-4o-mini-2024-07-18"),
            output: "enum",
            enum: possibleMoves,
            prompt: `${prompt}`,
        });

        if ("error" in result) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        console.log("Usage", result.usage);

        return NextResponse.json({ result: result.object });
    } catch (error: unknown) {
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
