
import { useState } from "react";
import { sendMessageToAI } from "../services/assistantAPI";
import "./AssistantChat.css";

function AssistantChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage }
    ]);

    setMessage("");
    setLoading(true);

    try {
      const data = await sendMessageToAI(userMessage);

      if (!data.success) {
        throw new Error(data.message || "AI request failed");
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.reply || "AI returned an empty response."
        }
      ]);

    } catch (error) {
      console.error("Frontend AI Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: error.response?.data?.message ||
                error.message ||
                "Unable to connect to AI."
        }
      ]);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assistant-container">
      <h2>AI Assistant</h2>

      <div className="chat-messages">
        {messages.map((item, index) => (
          <div key={index} className={`message ${item.sender}`}>
            <strong>{item.sender === "user" ? "You" : "AI"}</strong>
            <p>{item.text}</p>
          </div>
        ))}

        {loading && (
          <div className="message ai">
            AI is thinking...
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="chat-form">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything..."
          disabled={loading}
        />

        <button type="submit" disabled={loading || !message.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default AssistantChat;
