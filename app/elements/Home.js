import React, { useEffect, useState } from "react";
import axios from "axios";
import SelectedMail from "./selectedMail";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Home() {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [summary, setSummary] = useState("");
  const [filter, setFilter] = useState("All");
  const [emails, setEmails] = useState({ unread: [], read: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("jwtmail");

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("https://dmails.netlify.app/auth/emails", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmails(response.data); 
      } catch (error) {
        console.error("❌ Failed to fetch emails:", error);
        setError("Failed to fetch emails. Please try again.");
      }
      setLoading(false);
    };

    fetchEmails();
  }, []);

  const handleEmailClick = async (email, isUnread) => {
    setSelectedEmail(email);
    setSummary("");

    // ✅ Mark as read only if it's unread
    if (isUnread) {
      try {
        const response = await axios.post(
          "https://dmails.netlify.app/auth/emails/markAsRead",
          { emailId: email.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Email marked as read:", response.data);

        //  Move email from "unread" to "read"
        setEmails((prevEmails) => ({
          unread: prevEmails.unread.filter((e) => e.id !== email.id),
          read: [...prevEmails.read, email],
        }));
      } catch (error) {
        console.error("❌ Failed to mark email as read:", error.response?.data || error.message);
      }
    }

    //Fetch summary
    try {
      console.log("Emails:", email.snippet);
      const summaryResponse = await axios.post("https://dmails.netlify.app/ai/summarize", {
        text: email.snippet,
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      
      setSummary(summaryResponse.data.summary);
    } catch (error) {
      console.error("❌ AI Summarization Failed:", error);
      setSummary("Failed to generate summary.");
    }
  };

  // ✅ Filter emails based on selected category
  const filteredEmails =
    filter === "All"
      ? [...emails.unread, ...emails.read]
      : filter === "Unread"
        ? emails.unread
        : emails.read;

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row relative overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <BackgroundBeams />
      </div>

      {/* Email List Panel */}
      <div className="relative z-10 w-full md:w-1/3 h-1/3 md:h-full bg-gray-800 dark:bg-gray-800 p-4 overflow-y-auto">
        <div className="flex  justify-between mb-4">
          {["All", "Unread", "Read"].map((category) => (
            <button
              key={category}
              className={`p-2 rounded-lg ${filter === category ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"
                }`}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {loading && <p className="text-center text-gray-500">Loading emails...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && filteredEmails.length > 0 ? (
          filteredEmails.map((email) => (
            <div
              key={email.id}
              className={`m-2 p-3 cursor-pointer rounded-lg transition-all ${selectedEmail?.id === email.id
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                }`}
              onClick={() => handleEmailClick(email, emails.unread.includes(email))}
            >
              <p className="font-semibold">{email.sender}</p>
              <p className="text-sm">{email.snippet}</p>
            </div>
          ))
        ) : (
          !loading && <p className="text-center text-gray-500">No emails found</p>
        )}
      </div>

      <SelectedMail selectedEmail={selectedEmail} summary={summary} />
    </div>

  );
}
