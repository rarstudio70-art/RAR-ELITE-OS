import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MultiAISelector({ allAIs }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(allAIs || []);

  const toggleAI = (name) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const launchSession = () => {
    if (!selected.length) return;
    navigate("/ai/custom", { state: { selectedAIs: selected } });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <header className="mb-8">
          <div className="text-xs font-mono text-indigo-300/80 uppercase tracking-[0.25em]">
            RAR ELITE OS // MULTI‑AI CONFIG
          </div>
          <h1 className="mt-2 text-2xl md:text-3xl font-semibold">
            Custom Multi‑AI Session
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-xl">
            Toggle any combination of operators. Your selection will be passed
            into the unified chat engine for this session only.
          </p>
        </header>

        <main className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {allAIs.map((name) => {
              const active = selected.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleAI(name)}
                  className={
                    "rounded-xl border p-4 text-left transition " +
                    (active
                      ? "border-cyan-400 bg-slate-900 shadow-[0_0_25px_rgba(0,255,255,0.4)]"
                      : "border-slate-700 bg-slate-950 hover:border-slate-500")
                  }
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">{name}</span>
                    <span
                      className={
                        "h-2 w-2 rounded-full " +
                        (active ? "bg-cyan-400" : "bg-slate-600")
                      }
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    Operator in the RAR Elite OS cluster.
                  </p>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-slate-400">
              Selected:{" "}
              {selected.length
                ? selected.join(", ")
                : "No operators selected."}
            </p>
            <button
              onClick={launchSession}
              disabled={!selected.length}
              className={
                "rounded-full px-4 py-2 text-sm font-semibold transition " +
                (selected.length
                  ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                  : "bg-slate-700 text-slate-400 cursor-not-allowed")
              }
            >
              Launch Session
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}