import React, { useState, useRef, useEffect } from "react";

export default function ChatPage({ activeAIs = [] }) {
  const [messages, setMessages] = useState([]);
  const [pendingCommands, setPendingCommands] = useState([]);
  const [clusterThoughts, setClusterThoughts] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = {
      sender: "user",
      type: "text",
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);

    const userMessage = input;
    setInput("");
    setIsThinking(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          ais: activeAIs,
        }),
      });

      const data = await res.json();

      if (data.responses) {
        setMessages((prev) => [...prev, ...data.responses]);
      }

      if (data.cluster_thoughts) {
        setClusterThoughts((prev) => [...prev, ...data.cluster_thoughts]);
      }

    } catch (err) {
      console.error("Backend error:", err);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50">

      {/* LEFT: CHAT STREAM */}
      <div className="flex flex-col flex-1 border-r border-slate-800">

        {/* AI SELECTOR */}
        <div className="flex gap-2 p-4 border-b border-slate-800">
          {activeAIs.map((ai) => (
            <div
              key={ai}
              className="px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold"
            >
              {ai}
            </div>
          ))}
        </div>

        {/* CHAT MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-xs text-slate-400 mb-1">
                {msg.sender}
              </span>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                {msg.content}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="text-xs text-slate-400 italic">
              AI cluster is thinking…
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT BAR */}
        <div className="p-4 border-t border-slate-800 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 outline-none"
            placeholder="Ask your AI..."
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 font-semibold"
          >
            Send
          </button>
        </div>
      </div>

      {/* RIGHT: THOUGHT OVERVIEW + COMMAND PANEL */}
      <div className="w-80 border-l border-slate-800 p-4 overflow-y-auto">

        {/* CLUSTER THOUGHT OVERVIEW */}
        <h2 className="text-sm font-semibold mb-3">Cluster Thought Overview</h2>

        {clusterThoughts.length === 0 && (
          <p className="text-xs text-slate-500 mb-4">No cluster thoughts yet.</p>
        )}

        {clusterThoughts.map((t, i) => (
          <div
            key={i}
            className="mb-4 p-3 rounded-lg bg-slate-900 border border-slate-700"
          >
            <p className="text-xs text-slate-400 mb-1">
              {t.ais?.join(" · ")}
            </p>
            <p className="text-sm">{t.summary}</p>
          </div>
        ))}

        {/* COMMAND PANEL */}
        <h2 className="text-sm font-semibold mb-3 mt-6">Proposed Commands</h2>

        {pendingCommands.length === 0 && (
          <p className="text-xs text-slate-500">No commands yet.</p>
        )}

        {pendingCommands.map((cmd, i) => (
          <div
            key={i}
            className="mb-4 p-3 rounded-lg bg-slate-900 border border-slate-700"
          >
            <p className="text-xs text-slate-400 mb-1">{cmd.sender}</p>
            <p className="text-sm font-semibold mb-2">{cmd.command}</p>
            <p className="text-xs text-slate-400 mb-3">{cmd.explanation}</p>

            <div className="flex gap-2">
              <button className="px-3 py-1 rounded bg-emerald-600 text-xs">
                Approve & Run
              </button>
              <button className="px-3 py-1 rounded bg-red-600 text-xs">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
