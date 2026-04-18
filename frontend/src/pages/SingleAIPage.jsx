import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function SingleAIPage() {
  const { name } = useParams();
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate("/chat", {
      state: { selectedAIs: [name] },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-50">
      <h1 className="text-3xl font-bold mb-4 text-cyan-300">
        {name} — Single AI Mode
      </h1>

      <p className="text-slate-400 max-w-md text-center mb-6">
        You are about to enter a session with <span className="text-cyan-300">{name}</span> only.
        This mode uses the selected AI without the full cluster.
      </p>

      <button
        onClick={handleEnter}
        className="px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 font-semibold"
      >
        Enter {name}
      </button>
    </div>
  );
}