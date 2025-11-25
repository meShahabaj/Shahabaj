import { useState, useRef, useEffect } from "react";
import "./Assistant.css";
import axios from "axios";
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Assistant() {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi! I’m Shahabaj's assistant. How can I help you?" },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const result = await axios.post(`${BACKEND_URL}/chatbot/user_request`, userMsg);
            setTimeout(() => {
                const botMsg = { sender: "bot", text: result.data };
                setMessages((prev) => [...prev, botMsg]);
                setIsTyping(false);
            }, 500);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Oops! Something went wrong." },
            ]);
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div className="assistant-page">
            <div className="assistant-header">
                <h1>Shahabaj's Assistant</h1>
            </div>

            <div className="assistant-chat-container">
                <div className="assistant-messages">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`assistant-message ${msg.sender}`}
                        >
                            {msg.sender === "bot" ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                            ) : (
                                msg.text
                            )}
                        </div>
                    ))}
                    {isTyping && (
                        <div className="assistant-message bot typing">
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="assistant-input">
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
        </div>
    );
}
