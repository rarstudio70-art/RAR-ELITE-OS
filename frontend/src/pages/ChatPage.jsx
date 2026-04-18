import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ChatPage({ activeAIs = [] }) {
  const [messages, setMessages] = useState([]);
  const [pendingCommands, setPendingCommands] = useState([]);
  const [clusterThoughts, setClusterThoughts] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  const backend = "https://api.rar-eliteos.studio";

  const selectedFromState = location.state?.selectedAIs || [];
  const effectiveAIs =
    activeAIs && activeAIs.length ? activeAIs : selectedFromState;

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
      const authToken = localStorage.getItem("rar_auth_token");

      const headers = {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      };

      const res = await fetch(`${backend}/api/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: userMessage,
          ais: effectiveAIs,
        }),
      });

      if (!res.ok) {
        let detail = "Backend returned an error.";
        try {
          const errData = await res.json();
          if (errData && errData.detail) {
            detail = Array.isArray(errData.detail)
              ? errData.detail.map((d) => d.msg || d).join(" | ")
              : errData.detail;
          }
        } catch (_) {}

        setMessages((prev) => [
          ...prev,
          {
            sender: "system",
            type: "error",
            content: `ACCESS DENIED — ${detail}`,
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

      if (data.commands) {
        setPendingCommands((prev) => [...prev, ...data.commands]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          type: "error",
          content:
            "RAR Elite OS cluster unreachable. Check backend node or network.",
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
      <div className="pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:100%_3px]" />

      <div className="flex flex-col flex-1 border-r border-slate-800/60 backdrop-blur-sm bg-slate-950/40">
        <div className="flex gap-2 p-4 border-b border-slate-800/60">
          {effectiveAIs.map((ai) => (
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

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-xs text-slate-400 mb-1">
                {msg.sender}
              </span>

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
              Neural cluster evaluating...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

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

      <div className="w-80 border-l border-slate-800/60 p-4 overflow-y-auto backdrop-blur-sm bg-slate-950/40">
        <h2 className="text-sm font-semibold mb-3 text-cyan-300">
          Cluster Thought Overview
        </h2>

        {clusterThoughts.length === 0 && (
          <p className="text-xs text-slate-500 mb-4">
            No cluster thoughts yet.
          </p>
        )}

        {clusterThoughts.map((t, i) => (
          <div
            key={i}
            className="mb-4 p-3 rounded-lg bg-slate-900/40 border border-purple-400/40 shadow-[0_0_10px_rgba(155,0,255,0.3)] backdrop-blur-md"
          >
            <p className="text-xs text-purple-300 mb-1">
              {t.ais?.join(" · ")}
            </p>
            <p className="text-sm">{t.summary}</p>
          </div>
        ))}

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
            <p className="text-xs text-slate-400 mb-3">
              {cmd.explanation}
            </p>

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