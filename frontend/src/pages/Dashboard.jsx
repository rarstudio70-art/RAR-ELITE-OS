import React from "react";
import { useNavigate } from "react-router-dom";
import { isAdminActive } from "../admin";

export default function Dashboard() {
  const navigate = useNavigate();

  const adminActive = isAdminActive();

  const membershipActive =
    adminActive ||
    (typeof localStorage !== "undefined" &&
      localStorage.getItem("rar_auth_token") &&
      localStorage.getItem("rar_auth_token").trim().length > 10);

  const goToCheckout = () => {
    window.location.href =
      "https://rareliteos.gumroad.com/l/ikehsl?wanted=true";
  };

  const goToApiKey = () => navigate("/apikey");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">

        <header className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs font-mono text-cyan-400/80 uppercase tracking-[0.25em]">
              RAR ELITE OS // CONTROL PLANE
            </div>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold">
              Operator Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-xl">
              Choose how you want to work: unified cluster or custom multi‑AI sessions.
            </p>
          </div>
        </header>

        <div className="mb-8 p-4 rounded-xl border border-slate-700 bg-slate-900/60">
          {membershipActive ? (
            <div className="text-emerald-400 text-sm font-semibold">
              Membership Active — Unified AI Bundle Unlocked
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-red-400 text-sm font-semibold">
                Membership Inactive — Access Locked
              </div>
              <button
                onClick={goToCheckout}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500 transition"
              >
                Activate Unified AI Bundle
              </button>
            </div>
          )}

          {membershipActive && (
            <button
              onClick={goToApiKey}
              className="mt-4 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold hover:bg-cyan-500 transition"
            >
              Generate API Key
            </button>
          )}
        </div>

        <main className="grid gap-6 md:grid-cols-2">
          <button
            onClick={() => navigate("/ai/unified")}
            className="rounded-xl border border-cyan-500/40 bg-slate-950/80 p-5 text-left shadow-[0_0_30px_rgba(0,255,255,0.25)] hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(0,255,255,0.45)] transition"
          >
            <div className="text-xs font-mono text-cyan-300 mb-1">
              MODE // UNIFIED CLUSTER
            </div>
            <div className="text-lg font-semibold mb-1">
              Unified AI Workspace
            </div>
            <p className="text-xs text-slate-400">
              All 9 AI operators in one stream. Best for complex, cross‑domain work.
            </p>
          </button>

          <button
            onClick={() => navigate("/multi-ai")}
            className="rounded-xl border border-indigo-500/40 bg-slate-950/80 p-5 text-left shadow-[0_0_30px_rgba(129,140,248,0.25)] hover:border-indigo-400 hover:shadow-[0_0_40px_rgba(129,140,248,0.45)] transition"
          >
            <div className="text-xs font-mono text-indigo-300 mb-1">
              MODE // CUSTOM MULTI‑AI
            </div>
            <div className="text-lg font-semibold mb-1">
              Custom Multi‑AI Session
            </div>
            <p className="text-xs text-slate-400">
              Pick any combination of operators and launch a focused session.
            </p>
          </button>
        </main>
      </div>
    </div>
  );
}