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
      const apiKey = localStorage.getItem("rar_api_key");

      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey || "",
        },
        body: JSON.stringify({
          message: userMessage,
          ais: activeAIs,
        }),
      });

      if (res.status === 401) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "system",
            type: "error",
            content:
              "⚠️ ACCESS DENIED — No valid API key detected. Visit /apikey to generate one.",
            timestamp: Date.now(),
          },
        ]);
        return;
      }

      const data = await res.json();

      if (data.responses) {
        setMessages((prev) => [...prev, ...data.responses]);
      }

      if (data.cluster_thoughts) {
        setClusterThoughts((prev) => [...prev, ...data.cluster_thoughts]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          type: "error",
          content:
            "⚠️ RAR Elite OS cluster unreachable. Check backend node or network.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div
      className="flex h-screen text-slate-50 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(0,255,255,0.08), transparent), radial-gradient(circle at 80% 80%, rgba(155,0,255,0.08), transparent)",
      }}
    >
      {/* SCANLINES */}
      <div className="pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:100%_3px]" />

      {/* LEFT: CHAT STREAM */}
      <div className="flex flex-col flex-1 border-r border-slate-800/60 backdrop-blur-sm bg-slate-950/40">

        {/* AI SELECTOR */}
        <div className="flex gap-2 p-4 border-b border-slate-800/60">
          {activeAIs.map((ai) => (
            <div
              key={ai}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-300 ${
                isThinking
                  ? "border-cyan-400/70 shadow-[0_0_10px_rgba(0,255,255,0.5)] animate-pulse"
                  : "border-slate-700 bg-slate-800/60"
              }`}
            >
              {ai}
            </div>
          ))}
        </div>

        {/* CHAT MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-xs text-slate-400 mb-1">{msg.sender}</span>

              <div
                className={`p-3 rounded-lg border backdrop-blur-md transition-all duration-300 ${
                  msg.sender === "user"
                    ? "bg-slate-900/40 border-cyan-400/40 shadow-[0_0_8px_rgba(0,255,255,0.3)]"
                    : "bg-slate-900/40 border-purple-400/40 shadow-[0_0_8px_rgba(155,0,255,0.3)]"
                } ${
                  isThinking
                    ? "animate-pulse shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                    : ""
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="text-xs text-purple-300 italic animate-pulse">
              Neural cluster evaluating…
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT BAR */}
        <div className="p-4 border-t border-slate-800/60 flex gap-2 backdrop-blur-sm bg-slate-950/40">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-900/40 border border-slate-700/60 outline-none text-slate-100 focus:border-cyan-400 transition-all"
            placeholder="Enter command..."
          />
          <button
            onClick={handleSend}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              isThinking
                ? "bg-purple-600 animate-pulse"
                : "bg-cyan-600 hover:bg-cyan-500"
            }`}
          >
            Send
          </button>
        </div>
      </div>

      {/* RIGHT: THOUGHT OVERVIEW + COMMAND PANEL */}
      <div className="w-80 border-l border-slate-800/60 p-4 overflow-y-auto backdrop-blur-sm bg-slate-950/40">

        {/* CLUSTER THOUGHT OVERVIEW */}
        <h2 className="text-sm font-semibold mb-3 text-cyan-300">
          Cluster Thought Overview
        </h2>

        {clusterThoughts.length === 0 && (
          <p className="text-xs text-slate-500 mb-4">No cluster thoughts yet.</p>
        )}

        {clusterThoughts.map((t, i) => (
          <div
            key={i}
            className="mb-4 p-3 rounded-lg bg-slate-900/40 border border-purple-400/40 shadow-[0_0_10px_rgba(155,0,255,0.3)] backdrop-blur-md animate-fadeIn"
          >
            <p className="text-xs text-purple-300 mb-1">
              {t.ais?.join(" · ")}
            </p>
            <p className="text-sm">{t.summary}</p>
          </div>
        ))}

        {/* COMMAND PANEL */}
        <h2 className="text-sm font-semibold mb-3 mt-6 text-cyan-300">
          Proposed Commands
        </h2>

        {pendingCommands.length === 0 && (
          <p className="text-xs text-slate-500">No commands yet.</p>
        )}

        {pendingCommands.map((cmd, i) => (
          <div
            key={i}
            className="mb-4 p-3 rounded-lg bg-slate-900/40 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,255,255,0.3)] backdrop-blur-md"
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