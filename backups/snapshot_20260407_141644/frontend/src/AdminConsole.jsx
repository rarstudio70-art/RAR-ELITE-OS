import React, { useState } from "react";

export default function AdminConsole() {
  const [lines, setLines] = useState([
    "RAR Elite OS Admin Console",
    "Type 'help' to see available commands."
  ]);
  const [input, setInput] = useState("");

  const prompt = "PS RAR-Elite-OS> ";

  function appendLine(text) {
    setLines(prev => [...prev, text]);
  }

  function handleCommand(raw) {
    const cmd = raw.trim();
    if (!cmd) return;

    appendLine(prompt + cmd);

    if (cmd === "help") {
      appendLine("Available commands:");
      appendLine("  help   - Show this help");
      appendLine("  clear  - Clear the console");
      appendLine("  status - Show OS status");
      appendLine("  ai     - Show AI cluster info");
      appendLine("  mode   - Show OS mode");
      appendLine("  exit   - Close admin console (UI only)");
      return;
    }

    if (cmd === "clear") {
      setLines([]);
      return;
    }

    if (cmd === "status") {
      appendLine("OS Status: Stable");
      appendLine("Neural Link: Active");
      appendLine("Health: Green");
      return;
    }

    if (cmd === "ai") {
      appendLine("AI Cluster: 9 of 9 online");
      appendLine("Roles: Velora, Orin, Lyra, Forge, Atlas, Nova, Echo, Spectra, Astra");
      return;
    }

    if (cmd === "mode") {
      appendLine("OS Mode: Operator (Admin session)");
      return;
    }

    if (cmd === "exit") {
      appendLine("Admin console can only be closed from the main UI.");
      return;
    }

    appendLine("'" + cmd + "' is not recognized. Type 'help' for commands.");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const value = input;
    setInput("");
    handleCommand(value);
  }

  return (
    <div className="mt-4 rounded-xl border border-slate-800 bg-black text-slate-100 shadow-inner">
      <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2 text-xs text-slate-400">
        <span>RAR Elite OS · Admin Shell</span>
        <span>Private · PIN verified</span>
      </div>

      <div className="h-56 overflow-y-auto px-3 py-2 font-mono text-xs">
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center border-t border-slate-800 px-3 py-2 font-mono text-xs">
        <span className="text-emerald-400 mr-1">{prompt}</span>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-slate-100"
          autoFocus
        />
      </form>
    </div>
  );
}
