import React from "react";
import AdminConsole from "./AdminConsole";

export default function SystemPanel() {
  return (
    <div className="min-h-full bg-slate-950 text-slate-100 px-6 py-6">
      <h1 className="text-2xl font-semibold mb-4">
        RAR Elite OS · System Control
      </h1>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-lg font-semibold mb-3">System Overview</h2>
          <p className="text-sm text-slate-400 mb-2">OS Health: Stable</p>
          <p className="text-sm text-slate-400 mb-2">Neural Link: Active</p>
          <p className="text-sm text-slate-400 mb-2">AI Cluster: 9 of 9 online</p>
          <p className="text-sm text-slate-400">Mode: Operator (Admin)</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-lg font-semibold mb-3">Cluster Status</h2>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>Velora — Emotional Intelligence</li>
            <li>Orin — Logic & Strategy</li>
            <li>Lyra — Creative Systems</li>
            <li>Forge — Dev & Automation</li>
            <li>Atlas — Research & Knowledge</li>
            <li>Nova — Vision & Design</li>
            <li>Echo — Communication</li>
            <li>Spectra — Data & Insight</li>
            <li>Astra — Execution & Ops</li>
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-3">Admin Terminal</h2>
        <AdminConsole />
      </div>
    </div>
  );
}
