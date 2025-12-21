import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent, JSX } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL as string;

/* ---------- Types ---------- */
type Sender = "bot" | "user";

interface Message {
    sender: Sender;
    text: string;
}

export default function Assistant(): JSX.Element {
    const [messages, setMessages] = useState<Message[]>([
        { sender: "bot", text: "Hi! I’m Shahabaj's assistant. How can I help you today?" },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    /* ---------- Streaming Bot Message ---------- */
    const streamBotMessage = (fullText: string) => {
        let index = 0;
        setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

        const interval = setInterval(() => {
            index++;
            setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    sender: "bot",
                    text: fullText.slice(0, index),
                };
                return updated;
            });

            if (index >= fullText.length) {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 18);
    };

    const sendMessage = async (): Promise<void> => {
        if (!input.trim()) return;

        const userMsg: Message = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const result = await axios.post<string>(
                `${BACKEND_URL}/chatbot/user_request`,
                userMsg
            );
            streamBotMessage(result.data);
        } catch {
            setIsTyping(false);
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "⚠️ Something went wrong. Please try again." },
            ]);
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div className="h-screen w-full flex bg-gradient-to-br from-slate-50 via-zinc-50 to-neutral-100">

            <main className="flex-1 flex flex-col">

                {/* ---------- Header ---------- */}
                <header className="sticky top-0 z-10 border-b border-white/20">
                    <div className="relative overflow-hidden">
                        <div className="absolute inset-0 animated-gradient opacity-90" />
                        <div className="relative max-w-4xl mx-auto px-6 py-4 backdrop-blur-xl">
                            <h1 className="text-xl font-semibold text-white drop-shadow-sm">
                                Shahabaj&apos;s Assistant
                            </h1>
                            <p className="text-sm text-white/80">
                                Professional AI helper
                            </p>
                        </div>
                    </div>
                </header>

                {/* ---------- Messages ---------- */}
                <section className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex items-start gap-4 ${msg.sender === "user" ? "justify-end" : ""
                                    }`}
                            >
                                {/* Bot Avatar */}
                                {msg.sender === "bot" && (
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold shadow">
                                        S
                                    </div>
                                )}

                                {/* Bubble */}
                                <div
                                    className={`max-w-[75%] rounded-2xl px-5 py-4 text-sm leading-relaxed
                  ${msg.sender === "user"
                                            ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md ml-auto"
                                            : "bg-white text-zinc-800 border border-zinc-200 shadow-sm"
                                        }`}
                                >
                                    {msg.sender === "bot" ? (
                                        <div className="prose prose-sm max-w-none prose-zinc">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        msg.text
                                    )}
                                </div>

                                {/* User Avatar */}
                                {msg.sender === "user" && (
                                    <div className="w-9 h-9 rounded-full bg-zinc-800 text-white flex items-center justify-center text-sm shadow">
                                        U
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center text-sm shadow">
                                    S
                                </div>
                                <div className="bg-white border border-zinc-200 px-4 py-2 rounded-full shadow-sm flex gap-1">
                                    <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" />
                                    <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-150" />
                                    <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-300" />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </section>

                {/* ---------- Input ---------- */}
                <footer className="sticky bottom-0 z-10 border-t border-white/20">
                    <div className="relative overflow-hidden">
                        <div className="relative max-w-4xl mx-auto px-6 py-7 backdrop-blur-xl flex gap-4">
                            <input
                                type="text"
                                placeholder="Message Shahabaj’s Assistant..."
                                value={input}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setInput(e.target.value)
                                }
                                onKeyDown={handleKeyPress}
                                className="flex-1 px-5 py-3 rounded-full
                  bg-white/90 text-zinc-900 placeholder-zinc-500
                  border border-black
                  focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim()}
                                className="px-6 rounded-full font-semibold text-white
                  bg-gradient-to-br from-indigo-500 to-indigo-600
                  hover:from-indigo-600 hover:to-indigo-700
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition shadow-md"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </footer>

            </main>
        </div>
    );
}
