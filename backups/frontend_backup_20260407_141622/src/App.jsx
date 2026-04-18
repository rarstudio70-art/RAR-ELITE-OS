import React, { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import AdminConsole from "./AdminConsole";

export default function App() {
  const [mode, setMode] = useState("dark");
  const [adminPromptOpen, setAdminPromptOpen] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState("");

  const SECRET_PIN = "1321";
  const isLight = mode === "light";
  const year = new Date().getFullYear();

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

  const handleAdminUnlock = () => {
    if (adminPinInput === SECRET_PIN) {
      setAdminUnlocked(true);
      setAdminPromptOpen(false);
      setAdminPinInput("");
    } else {
      setAdminPinInput("");
    }
  };

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
            onDoubleClick={() => setAdminPromptOpen(true)}
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

          <div className="flex items-center gap-3 text-xs">
            <ThemeToggle mode={mode} onToggle={handleToggle} variant="nav" />
            <button
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
        <section className="w-full">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            {/* LEFT SIDE */}
            <div>
              <div
                className={
                  "mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.75rem] font-medium " +
                  (isLight
                    ? "border-slate-200 bg-white/70 text-slate-600"
                    : "border-slate-700 bg-slate-950/70 text-slate-300")
                }
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                9 AI today. One unified OS.
              </div>

              <h1
                className={
                  "mb-4 text-4xl sm:text-5xl font-semibold leading-tight tracking-tight " +
                  strongText
                }
              >
                A neural operating system
                <span className="block bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                  for people who already live in AI.
                </span>
              </h1>

              <p className={"mb-6 max-w-xl text-[1rem] " + subtleText}>
                RAR Elite OS unifies multiple AI into one operating system, so you have a single place to think, plan, build, and execute without juggling tools.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <button
                  className={
                    "rounded-full px-5 py-2 font-semibold shadow-md transition " +
                    (isLight
                      ? "bg-slate-900 text-slate-50 shadow-slate-400/40 hover:bg-slate-800"
                      : "bg-indigo-500 text-white shadow-indigo-500/40 hover:bg-indigo-400")
                  }
                >
                  Start with Founder Access
                </button>
                <button
                  className={
                    "rounded-full border px-5 py-2 font-medium transition " +
                    (isLight
                      ? "border-slate-300 bg-white/70 text-slate-800 hover:bg-slate-100"
                      : "border-slate-700 bg-slate-950/70 text-slate-200 hover:bg-slate-900/80")
                  }
                >
                  See how it works
                </button>
              </div>
            </div>

            {/* RIGHT SIDE PLACEHOLDER */}
            <div className="hidden md:block" />
          </div>

          {/* REACTOR-GLASS SYSTEM STRIP */}
          <div className="relative mt-10 flex justify-center">
            <div
              className={
                "relative w-full max-w-4xl rounded-2xl border backdrop-blur shadow-xl " +
                (isLight
                  ? "border-slate-200 bg-white/80 shadow-slate-300/50"
                  : "border-slate-800 bg-slate-950/80 shadow-indigo-500/30")
              }
            >
              {/* Holographic glow */}
              <div
                className={
                  "pointer-events-none absolute -inset-px rounded-2xl opacity-60 blur-xl bg-gradient-to-r " +
                  accentGlow
                }
              />

              {/* Scanlines */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-20 mix-blend-soft-light bg-[linear-gradient(to_bottom,rgba(148,163,184,0.25)_1px,transparent_1px)] bg-[length:100%_3px]" />

              {/* Grid */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-20 bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.35),transparent_55%)]" />

              {/* Content */}
              <div className="relative px-5 py-4 sm:px-6 sm:py-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p
                      className={
                        "text-[0.7rem] font-semibold uppercase tracking-[0.18em] " +
                        (isLight ? "text-slate-500" : "text-slate-400")
                      }
                    >
                      System Status
                    </p>
                    <p
                      className={
                        "mt-1 text-sm " +
                        (isLight ? "text-slate-700" : "text-slate-300")
                      }
                    >
                      Neural operating system online. AI cluster is active and synchronized.
                    </p>
                  </div>
                  <span
                    className={
                      "rounded-full px-3 py-1 text-[0.7rem] font-semibold " +
                      (isLight
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-300/70"
                        : "bg-emerald-500/15 text-emerald-300 border border-emerald-400/40")
                    }
                  >
                    OS Health: Stable
                  </span>
                </div>

                {/* Status row + reactor core */}
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Status items */}
                  <div className="grid grid-cols-3 gap-2 text-[0.75rem] sm:max-w-xs">
                    <div
                      className={
                        "rounded-lg border px-3 py-2 " +
                        (isLight
                          ? "border-slate-200 bg-white/80"
                          : "border-slate-800 bg-slate-950/80")
                      }
                    >
                      <p className={subtleText + " text-[0.65rem]"}>AI Online</p>
                      <p className={strongText + " text-sm font-semibold"}>
                        9 of 9
                      </p>
                    </div>
                    <div
                      className={
                        "rounded-lg border px-3 py-2 " +
                        (isLight
                          ? "border-slate-200 bg-white/80"
                          : "border-slate-800 bg-slate-950/80")
                      }
                    >
                      <p className={subtleText + " text-[0.65rem]"}>Neural Link</p>
                      <p className={strongText + " text-sm font-semibold"}>
                        Active
                      </p>
                    </div>
                    <div
                      className={
                        "rounded-lg border px-3 py-2 " +
                        (isLight
                          ? "border-slate-200 bg-white/80"
                          : "border-slate-800 bg-slate-950/80")
                      }
                    >
                      <p className={subtleText + " text-[0.65rem]"}>OS Mode</p>
                      <p className={strongText + " text-sm font-semibold"}>
                        Operator
                      </p>
                    </div>
                  </div>

                  {/* Reactor core visualization */}
                  <div className="flex flex-1 justify-end">
                    <div className="relative h-24 w-24 sm:h-28 sm:w-28">
                      <div className="absolute inset-0 rounded-full border border-indigo-500/40" />
                      <div className="absolute inset-3 rounded-full border border-cyan-400/40" />
                      <div className="absolute inset-6 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 opacity-80 blur-[1px]" />
                      <div className="absolute inset-9 rounded-full bg-slate-950/90" />
                      <div className="absolute inset-[2.35rem] sm:inset-[2.7rem] rounded-full bg-gradient-to-br from-cyan-300 to-indigo-400 opacity-80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section
          className={
            "mt-10 flex flex-wrap items-center justify-between gap-3 border-y py-4 text-[0.85rem] " +
            (isLight ? "border-slate-200 text-slate-500" : "border-slate-800 text-slate-400")
          }
        >
          <p>
            Built for founders and operators who already use AI daily and want it unified into one system.
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
            9 AI. One unified OS.
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

        {/* PRICING */}
        <section className="mt-12 max-w-5xl mx-auto w-full grid gap-8 md:grid-cols-[1.2fr,1fr] md:items-center">
          <div>
            <h2 className={"text-xl font-semibold mb-3 " + strongText}>
              Pricing that respects your brain.
            </h2>
            <p className={"text-[0.9rem] mb-4 " + subtleText}>
              Clear pricing. No usage traps. No nonsense.
            </p>
            <ul className={"space-y-2 text-[0.9rem] " + subtleText}>
              <li>- All 9 AI modules</li>
              <li>- Unified neural workspace</li>
              <li>- Cancel anytime</li>
            </ul>
          </div>

          <div
            className={
              "rounded-2xl border p-6 shadow-xl " +
              (isLight
                ? "border-slate-200 bg-white/95 shadow-slate-300/50"
                : "border-indigo-500/70 bg-slate-950/90 shadow-indigo-500/30")
            }
          >
            <p
              className={
                "text-[0.75rem] font-medium uppercase tracking-[0.18em] " +
                (isLight ? "text-slate-500" : "text-indigo-300")
              }
            >
              Founder Access
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className={"text-4xl font-semibold " + strongText}>
                $29
              </span>
              <span className={"text-sm " + subtleText}>per month</span>
            </div>
            <button
              className={
                "mt-5 w-full rounded-full px-4 py-2.5 text-sm font-semibold shadow-md transition " +
                (isLight
                  ? "bg-slate-900 text-slate-50 shadow-slate-400/40 hover:bg-slate-800"
                  : "bg-indigo-500 text-white shadow-indigo-500/40 hover:bg-indigo-400")
              }
            >
              Subscribe and Unlock
            </button>

            {adminUnlocked && (
              <div className="mt-5">
                <AdminConsole />
              </div>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer
          className={
            "mt-10 border-t pt-4 text-center text-[0.8rem] " +
            (isLight ? "border-slate-200 text-slate-500" : "border-slate-800 text-slate-500")
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
