"use client";
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { SendHorizonal } from "lucide-react";
import ChatInput from "./components/ChatInput";
import MessageBubble from "./components/MessageBubble";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (query: string) => {
    if (!query.trim()) return;
    setMessages([...messages, { role: "user", text: query }]);
    setLoading(true);

    try {
      const res = await axios.post(
        "https://genzai-backend.onrender.com/ask",
        { query }
      );
      const reply = res.data.answer || "No response available.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Backend not reachable right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0e0e10] text-white">
      <header className="p-4 text-center text-lg font-semibold border-b border-gray-800">
        GenzAI 🤖 — made by Owais from Kashmir
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} text={m.text} />
        ))}
        {loading && (
          <motion.div
            className="text-gray-400 italic"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Thinking...
          </motion.div>
        )}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}
