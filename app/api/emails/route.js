import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req) {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "").trim();
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const response = await axios.get("https://dmails.netlify.app/auth/emails", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return NextResponse.json(response.data);
    } catch (error) {
        console.error("❌ Error fetching emails:", error);
        return NextResponse.json({ message: "Failed to fetch emails" }, { status: 500 });
    }
}
