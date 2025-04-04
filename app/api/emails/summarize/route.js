import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) { 
    try {
        const { text } = await req.json(); 
        if (!text) {
            return NextResponse.json({ error: "Text is required for summarization" }, { status: 400 });
        }

        const summaryResponse = await axios.post("https://dmails.netlify.app/ai/summarize", {
            text,
        });

        return NextResponse.json({ summary: summaryResponse.data.summary }); 
    } catch (error) {
        console.error("❌ AI Summarization Failed:", error);
        return NextResponse.json({ error: "Failed to generate summary." }, { status: 500 });
    }
}
