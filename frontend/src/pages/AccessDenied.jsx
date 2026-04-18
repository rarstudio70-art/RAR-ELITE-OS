import React from "react";
import { Link } from "react-router-dom";

export default function AccessDenied() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-200">
      <div className="text-center p-8 rounded-xl border border-red-500/40 bg-slate-900/60 shadow-[0_0_20px_rgba(255,0,0,0.3)]">
        <h1 className="text-2xl font-bold text-red-400 mb-3">
          ACCESS DENIED
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          No valid API key detected.  
          Authenticate to continue.
        </p>

        <Link
          to="/apikey"
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
        >
          Enter API Key
        </Link>
      </div>
    </div>
  );
}