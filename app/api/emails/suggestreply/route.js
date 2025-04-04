import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { text, sender, recipientId } = await req.json(); // ✅ Extract body properly

        if (!text || !sender || !recipientId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const replyResponse = await axios.post("https://dmails.netlify.app/ai/suggestreply", {
            text,
            sender,
            recipientId,
        });

        return NextResponse.json({ replies: replyResponse.data.replies }); // ✅ Correct response format
    } catch (error) {
        console.error("❌ AI Reply Suggestion Failed:", error);
        return NextResponse.json({ error: "Failed to generate replies." }, { status: 500 });
    }
}
