import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) { 
    try {
        const authHeader = req.headers.get("Authorization");
        const token = authHeader?.replace("Bearer ", "").trim();

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { emailId } = await req.json();
        console.log("Received emailId:", emailId); // ✅ Debugging line
        const response = await axios.post(
            "https://dmails.netlify.app/auth/emails/markAsRead",
            { emailIds: [emailId] }, // ✅ Ensure correct format
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return NextResponse.json({ message: "Email marked as read", data: response.data });
    } catch (error) {
        console.error("❌ Failed to mark email as read:", error.response?.data || error.message);
        return NextResponse.json({ message: "Failed to mark email as read" }, { status: 500 });
    }
}
