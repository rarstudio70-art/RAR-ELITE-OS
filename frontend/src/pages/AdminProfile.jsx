import React from "react";
import { useNavigate } from "react-router-dom";
import { deactivateAdmin, ADMIN_EMAIL } from "../admin";

export default function AdminProfile() {
  const navigate = useNavigate();

  const handleExitAdmin = () => {
    deactivateAdmin();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
        <header className="mb-8">
          <div className="text-xs font-mono text-emerald-300/80 uppercase tracking-[0.25em]">
            RAR ELITE OS // ADMIN PROFILE
          </div>
          <h1 className="mt-2 text-2xl md:text-3xl font-semibold">
            Founder Console
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-xl">
            This profile has full access to all nodes, regardless of API key or
            licensing state. Use it to operate and evolve the OS.
          </p>
        </header>

        <main className="space-y-6">
          <section className="rounded-xl border border-emerald-500/40 bg-slate-950/80 p-5 shadow-[0_0_30px_rgba(16,185,129,0.35)]">
            <h2 className="text-sm font-semibold mb-2">Identity</h2>
            <p className="text-xs text-slate-400">
              <span className="font-mono text-emerald-300">OWNER EMAIL:</span>{" "}
              {ADMIN_EMAIL}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              <span className="font-mono text-emerald-300">ROLE:</span> Founder
              · Full cluster access
            </p>
          </section>

          <section className="rounded-xl border border-slate-700 bg-slate-950/80 p-5">
            <h2 className="text-sm font-semibold mb-2">Capabilities</h2>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Bypass API key checks across the OS.</li>
              <li>• Access all chat modes and dashboards.</li>
              <li>• Test flows without touching billing or licensing.</li>
              <li>• Future: manage Gumroad licenses and user tiers.</li>
            </ul>
          </section>

          <div className="flex justify-end">
            <button
              onClick={handleExitAdmin}
              className="rounded-full px-4 py-2 text-sm font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
            >
              Exit Admin Mode
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}