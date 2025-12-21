import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent, JSX } from "react";
import axios from "axios";
import { IoIosExpand } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL as string;

/* ---------- Types ---------- */
type Sender = "bot" | "user";

interface Message {
  sender: Sender;
  text: string;
}

export default function Chatbot(): JSX.Element {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hi! I’m Shahabaj's assistant. How can I help you?" },
  ]);
  const [input, setInput] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const result = await axios.post<string>(
        `${BACKEND_URL}/chatbot/user_request`,
        userMsg
      );

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: result.data },
        ]);
      }, 500);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again." },
      ]);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="fixed bottom-5 right-5 z-[1000] font-sans">
      {/* Toggle Button */}
      <div className="flex items-center ">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-14 h-14 rounded-full bg-indigo-600 text-white text-4xl
                   shadow-lg hover:bg-indigo-700 transition flex items-center justify-center"
        >
          {isOpen ? "×" : "💬"}
        </button>

        {isOpen && (
          <button
            onClick={() => navigate("/projects/assistant")}
            className="w-14 h-14 rounded-full bg-indigo-600 text-white
                     shadow-lg hover:bg-indigo-700 transition
                     flex items-center justify-center"
          >
            <IoIosExpand size={22} />
          </button>
        )}</div>

      {/* Chat Window */}
      {isOpen && (
        <div className="mt-2 w-72 max-h-[400px] bg-white rounded-xl shadow-2xl
                        flex flex-col overflow-hidden">

          {/* Header */}
          <div className="bg-indigo-600 text-white text-center font-bold p-3">
            Shahabaj's Assistant
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 space-y-2 overflow-y-auto bg-gray-100">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`px-4 py-2 rounded-full max-w-[80%] text-sm break-words
                  ${msg.sender === "user"
                    ? "bg-indigo-600 text-white ml-auto"
                    : "bg-gray-200 text-black mr-auto"
                  }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex border-t">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInput(e.target.value)
              }
              onKeyDown={handleKeyPress}
              className="flex-1 px-3 py-2 text-sm outline-none"
            />
            <button
              onClick={sendMessage}
              className="px-4 bg-indigo-600 text-white font-semibold
                         hover:bg-indigo-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
