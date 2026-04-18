import React from "react";
import { useNavigate } from "react-router-dom";

export default function UnifiedAIPage() {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate("/chat", {
      state: { selectedAIs: [] }, // empty = unified cluster (ALL AIs)
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-50">
      <h1 className="text-3xl font-bold mb-4 text-cyan-300">
        Unified AI Cluster
      </h1>

      <p className="text-slate-400 max-w-md text-center mb-6">
        Enter the full multi‑AI cluster. All AIs will collaborate and vote to
        produce a single optimized response.
      </p>

      <button
        onClick={handleEnter}
        className="px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 font-semibold"
      >
        Enter Unified Cluster
      </button>
    </div>
  );
}