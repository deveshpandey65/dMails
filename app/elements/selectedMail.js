
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BackgroundBeams } from "@/components/ui/background-beams";
export default function SelectedMail({ selectedEmail,summary }) {
    const [fetchingReplies, setFetchingReplies] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [suggestedReplies, setSuggestedReplies] = useState([]);
    const handleSuggestReplies = async () => {
        setFetchingReplies(true);
        setShowReplies(true);
        setSuggestedReplies([]);
        try {
            const receiver = localStorage.getItem("usermail") || ""; 
            const replyResponse = await axios.post("http://localhost:8888/ai/suggestreply", {
                text: selectedEmail.snippet,
                sender: selectedEmail.sender,
                recipientId: receiver,
            });

            setSuggestedReplies(Array.isArray(replyResponse.data.replies) ? replyResponse.data.replies : ["Failed to generate replies."]);
        } catch (error) {
            console.error("❌ AI Reply Suggestion Failed:", error);
            setSuggestedReplies(["Failed to generate replies."]);
        }
        setFetchingReplies(false);
    };
  return (
    <>
      <div className="flex-1 p-6  bg-gray-700 dark:bg-gray-700 text-gray-800 dark:text-white relative overflow-y-auto max-h-screen">
          {selectedEmail ? (
              <div className="overflow-y-auto max-h-full p-4 w-[95%] z-50">
                  <h2 className="text-2xl font-bold">{selectedEmail.subject}</h2>
                  <p className="mt-2 text-white text-lg">From: {selectedEmail.sender}</p>
                  <div className="mt-4 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
                      <h3 className="font-bold">AI Summary:</h3>
                      {!summary ? <p className="text-blue-500">Summarizing...</p> : <p>{summary}</p>}
                  </div>
                  <button
                      className="mt-4 p-2 bg-blue-500 text-white rounded-lg"
                      onClick={handleSuggestReplies}
                      disabled={fetchingReplies}
                  >
                      {fetchingReplies ? "Generating..." : "Suggest Reply"}
                  </button>
                  {showReplies && (
                      <div className="mt-4 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
                          <h3 className="font-bold">AI Suggested Replies:</h3>
                          {fetchingReplies ? <p className="text-blue-500">Generating replies...</p> : (
                              <ul className="list-disc list-inside">
                                  {suggestedReplies.map((reply, index) => (
                                      <li key={index} className="mt-2 p-2 bg-gray-300 dark:bg-gray-600 rounded">
                                          <p>{reply.message}</p>
                                      </li>
                                  ))}
                              </ul>
                          )}
                      </div>
                  )}
                  <div className="mt-4 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
                      <h3 className="font-bold">Full Mail:</h3>
                      {console.log(selectedEmail)}
                      <p>{selectedEmail.snippet}</p>
                  </div>
              </div>
          ) : (
              <p className="text-gray-500">Select an email to view details</p>
          )}
          
      </div>
      </>
  )
}
