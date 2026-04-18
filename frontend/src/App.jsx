import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import AdminConsole from "./AdminConsole";
import { activateAdmin, isAdminActive, ADMIN_PIN } from "./admin";

export default function App() {
  const [mode, setMode] = useState("dark");
  const [adminPromptOpen, setAdminPromptOpen] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(isAdminActive());
  const [adminPinInput, setAdminPinInput] = useState("");

  const SECRET_PIN = ADMIN_PIN;
  const isLight = mode === "light";
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  const shellBg = isLight
    ? "bg-slate-50 text-slate-900"
    : "bg-slate-950 text-slate-50";

  const heroBgLayer = isLight
    ? "from-slate-100 via-slate-50 to-slate-100"
    : "from-[#020617] via-slate-950 to-[#020617]";

  const accentGlow = isLight
    ? "from-sky-300 via-cyan-300 to-indigo-300"
    : "from-indigo-500 via-purple-500 to-cyan-400";

  const subtleText = isLight ? "text-slate-500" : "text-slate-400";
  const strongText = isLight ? "text-slate-900" : "text-slate-50";

  const panelBg = isLight
    ? "bg-white/80 border-slate-200/80"
    : "bg-slate-950/80 border-slate-800/80";

  const handleToggle = () => setMode(isLight ? "dark" : "light");

  // SECURE ADMIN LOGIN — CALL BACKEND FOR JWT
  const handleAdminUnlock = async () => {
    if (adminPinInput !== SECRET_PIN) {
      setAdminPinInput("");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: adminPinInput }),
      });

      if (!res.ok) {
        setAdminPinInput("");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);

      activateAdmin();
      setAdminUnlocked(true);
      setAdminPromptOpen(false);
      setAdminPinInput("");
    } catch (err) {
      setAdminPinInput("");
    }
  };

  const handleLogoClick = (e) => {
    if (e.ctrlKey) {
      setAdminPromptOpen(true);
    }
  };

  const goToApiKey = () => navigate("/apikey");
  const goToDashboard = () => navigate("/dashboard");
  const goToLogin = () => navigate("/login");
  const goToRegister = () => navigate("/register");
  const goToChat = () => navigate("/chat");

  return (
    <div className={"min-h-screen " + shellBg}>
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className={"absolute inset-0 bg-gradient-to-b " + heroBgLayer} />
        <div
          className={
            "absolute -top-40 left-1/2 h-[32rem] w-[48rem] -translate-x-1/2 rounded-full opacity-50 blur-3xl bg-gradient-to-r " +
            accentGlow
          }
        />
      </div>

      {/* Floating toggle */}
      <div className="fixed bottom-6 right-6 z-30">
        <ThemeToggle mode={mode} onToggle={handleToggle} variant="floating" />
      </div>

      {/* Shell */}
      <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col px-6 py-6">
        {/* NAVBAR */}
        <header className="mb-8 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={handleLogoClick}
            title="CTRL + Click for admin"
          >
            <div
              className={
                "h-9 w-9 rounded-2xl border bg-gradient-to-tr " +
                accentGlow +
                " shadow-lg " +
                (isLight
                  ? "border-slate-200 shadow-sky-300/40"
                  : "border-slate-800 shadow-indigo-500/40")
              }
            />
            <div className="flex flex-col leading-tight">
              <span className={"text-base font-semibold " + strongText}>
                RAR Elite OS
              </span>
              <span className={"text-[0.75rem] " + subtleText}>
                Neural workspace for operators
              </span>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex items-center gap-3 text-xs">
            <ThemeToggle mode={mode} onToggle={handleToggle} variant="nav" />

            <button
              onClick={goToChat}
              className={
                "rounded-full px-4 py-1.5 font-semibold border transition " +
                (isLight
                  ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                  : "border-slate-700 text-slate-200 hover:bg-slate-900")
              }
            >
              Chat
            </button>

            <button
              onClick={goToDashboard}
              className={
                "rounded-full px-4 py-1.5 font-semibold border transition " +
                (isLight
                  ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                  : "border-slate-700 text-slate-200 hover:bg-slate-900")
              }
            >
              Account
            </button>

            <button
              onClick={goToApiKey}
              className={
                "rounded-full px-4 py-1.5 font-semibold border transition " +
                (isLight
                  ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                  : "border-slate-700 text-slate-200 hover:bg-slate-900")
              }
            >
              API Key
            </button>

            <button
              onClick={goToApiKey}
              className={
                "rounded-full px-4 py-1.5 font-semibold shadow-md transition " +
                (isLight
                  ? "bg-slate-900 text-slate-50 shadow-slate-400/40 hover:bg-slate-800"
                  : "bg-indigo-500 text-white shadow-indigo-500/40 hover:bg-indigo-400")
              }
            >
              Get Access
            </button>
          </div>
        </header>

        {/* HERO */}
        <main className="grid gap-10 md:grid-cols-[1.2fr,1fr] md:items-center">
          <div className="space-y-6">
            <div
              className={
                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.75rem] " +
                (isLight
                  ? "border-slate-200 bg-white/70 text-slate-600"
                  : "border-slate-800 bg-slate-950/70 text-slate-300")
              }
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              RAR Elite OS · Multi‑AI operator workspace
            </div>

            <div className="space-y-3">
              <h1
                className={
                  "text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight " +
                  strongText
                }
              >
                9 specialized AI, 1 Unified System
              </h1>
              <p className={"text-sm md:text-[0.95rem] " + subtleText}>
                9 Specialized AI under your commands
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <button
                onClick={goToRegister}
                className={
                  "rounded-full px-4 py-2 font-semibold shadow-md transition " +
                  (isLight
                    ? "bg-slate-900 text-slate-50 shadow-slate-400/40 hover:bg-slate-800"
                    : "bg-indigo-500 text-white shadow-indigo-500/40 hover:bg-indigo-400")
                }
              >
                Create Account
              </button>
              <button
                onClick={goToLogin}
                className={
                  "rounded-full px-4 py-2 font-semibold border text-xs md:text-sm " +
                  (isLight
                    ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                    : "border-slate-700 text-slate-200 hover:bg-slate-900")
                }
              >
                Log In
              </button>
              <button
                onClick={goToDashboard}
                className={
                  "rounded-full px-4 py-2 font-semibold border text-xs md:text-sm " +
                  (isLight
                    ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                    : "border-slate-700 text-slate-200 hover:bg-slate-900")
                }
              >
                Launch Workspace
              </button>
            </div>

            <p className={"text-[0.8rem] " + subtleText}>
              First‑time users: generate your API key on the Access Layer page.
              Returning operators: jump straight into the workspace.
            </p>
          </div>

          <div
            className={
              "relative overflow-hidden rounded-2xl border p-5 shadow-xl " +
              panelBg
            }
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_55%),radial-gradient(circle_at_bottom,_rgba(129,140,248,0.18),transparent_55%)] opacity-80" />
            <div className="relative z-10 space-y-4">
              <p className={"text-xs font-mono " + subtleText}>
                LIVE MODES // RAR ELITE OS
              </p>
              <ul className="space-y-2 text-sm">
                <li className={strongText}>Unified Cluster · All 9 AI</li>
                <li className={strongText}>Single‑AI Focus · 1:1 sessions</li>
                <li className={strongText}>Custom Multi‑AI · any combination</li>
              </ul>
              <p className={"text-[0.8rem] " + subtleText}>
                Your brain stays in one place. The OS routes work to the right
                AI at the right time.
              </p>
            </div>
          </div>
        </main>

        {/* TRUST STRIP */}
        <section
          className={
            "mt-10 flex flex-wrap items-center justify-between gap-3 border-y py-4 text-[0.85rem] " +
            (isLight
              ? "border-slate-200 text-slate-500"
              : "border-slate-800 text-slate-400")
          }
        >
          <p>
            Built for founders and operators who already use AI daily and want
            it unified into one system.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Launch planning", "Product copy", "Technical workflows"].map(
              (tag) => (
                <span
                  key={tag}
                  className={
                    "rounded-full px-3 py-1 " +
                    (isLight
                      ? "border border-slate-200 bg-white/80"
                      : "border border-slate-800 bg-slate-950/80")
                  }
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </section>

        {/* 9 AI SECTION */}
        <section className="mt-10 max-w-5xl mx-auto w-full">
          <h2 className={"text-xl font-semibold mb-2 " + strongText}>
            9 AI Ready to help you with any task.
          </h2>
          <p className={"text-[0.9rem] mb-4 " + subtleText}>
            Each AI specializes. The OS unifies them into one mental model.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Velora", role: "Emotional Intelligence" },
              { name: "Orin", role: "Logic and Strategy" },
              { name: "Lyra", role: "Creative Systems" },
              { name: "Cortex", role: "Systems Reasoning" },
              { name: "Sera", role: "Empathy & Human Insight" },
              { name: "Nexa", role: "Foresight & Prediction" },
              { name: "Forge", role: "Dev and Automation" },
              { name: "Astra", role: "Execution and Ops" },
              { name: "Titan", role: "High-Power Analysis" },
            ].map((ai, i) => (
              <div
                key={i}
                className={
                  "rounded-xl border p-4 transition " +
                  (isLight
                    ? "border-slate-200 bg-white/85 hover:border-sky-300"
                    : "border-slate-800 bg-slate-950/85 hover:border-indigo-500/70")
                }
              >
                <p className={"text-base font-semibold " + strongText}>
                  {ai.name}
                </p>
                <p className={"text-sm mt-1 " + subtleText}>{ai.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ADMIN CONSOLE */}
        {adminUnlocked && (
          <section className="mt-10 max-w-3xl mx-auto w-full">
            <div
              className={
                "rounded-2xl border p-6 " +
                (isLight
                  ? "border-slate-200 bg-white/95"
                  : "border-slate-800 bg-slate-950/90")
              }
            >
              <p className={"text-sm mb-3 " + subtleText}>Admin Console</p>
              <AdminConsole />
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer
          className={
            "mt-10 border-t pt-4 text-center text-[0.8rem] " +
            (isLight
              ? "border-slate-200 text-slate-500"
              : "border-slate-800 text-slate-500")
          }
        >
          © {year} RAR Elite OS · Neural workspace for operators.
        </footer>
      </div>

      {/* ADMIN PIN MODAL */}
      {adminPromptOpen && !adminUnlocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-xs rounded-xl bg-slate-950 border border-slate-700 p-4 shadow-xl">
            <h2 className="text-sm font-semibold text-slate-100 mb-2">
              Admin Access
            </h2>
            <p className="text-xs text-slate-400 mb-3">
              Enter your 4-digit admin code.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAdminUnlock();
              }}
              className="space-y-3"
            >
              <input
                type="password"
                maxLength={4}
                value={adminPinInput}
                onChange={(e) => setAdminPinInput(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 outline-none"
              />
              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setAdminPromptOpen(false);
                    setAdminPinInput("");
                  }}
                  className="px-3 py-1 rounded-md border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded-md bg-indigo-500 text-white"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}