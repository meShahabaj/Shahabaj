import { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import axios from "axios";
import { IoIosExpand } from "react-icons/io";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Chatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I’m Shahabaj's assistant. How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    setInput("");

    const botResponse = async () => {
      const result = await axios.post(`${BACKEND_URL}/chatbot/user_request`, userMsg);

      setTimeout(() => {
        const botMsg = { sender: "bot", text: result.data };
        setMessages((prev) => [...prev, botMsg]);
      }, 500);
    }
    botResponse();

  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chatbot-container">
      {/* Floating Chat Button */}
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "×" : "💬"}
      </button>
      {
        isOpen && (<>
          <button
            className="chatbot-toggle">
            <IoIosExpand onClick={() => navigate("/assistant")} />
          </button>
        </>)
      }


      {/* Chat Window */}
      {
        isOpen && (
          <div className="chatbot-window">
            <div className="chatbot-header">Shahabaj's Assistant</div>

            <div className="chatbot-messages">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chatbot-message ${msg.sender}`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        )
      }
    </div >
  );
}
