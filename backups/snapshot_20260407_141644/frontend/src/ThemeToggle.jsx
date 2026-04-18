import React from "react";

export default function ThemeToggle({ mode, onToggle, variant = "nav" }) {
  const isLight = mode === "light";

  const base =
    "inline-flex items-center cursor-pointer rounded-full transition-colors duration-300";
  const sizes =
    variant === "nav"
      ? "h-7 px-1.5 text-[0.65rem]"
      : "h-11 w-11 p-1.5 text-[0.6rem]";
  const bg =
    variant === "nav"
      ? isLight
        ? "bg-slate-100/90 border border-slate-300/70"
        : "bg-slate-900/80 border border-slate-700/80"
      : isLight
      ? "bg-slate-100/95 border border-slate-300/80 shadow-lg shadow-slate-400/40"
      : "bg-slate-900/90 border border-indigo-500/60 shadow-lg shadow-indigo-500/40";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={base + " " + sizes + " " + bg}
      aria-label="Toggle interface mode"
    >
      {variant === "nav" ? (
        <>
          <span
            className={
              "flex h-4 w-4 items-center justify-center rounded-full text-[0.55rem] mr-1.5 transition-colors " +
              (isLight
                ? "bg-slate-900 text-slate-100"
                : "bg-indigo-400 text-slate-900")
            }
          >
            {isLight ? "Q" : "N"}
          </span>
          <span
            className={
              "font-medium tracking-[0.16em] uppercase transition-colors " +
              (isLight ? "text-slate-700" : "text-slate-300")
            }
          >
            {isLight ? "Quantum" : "Neural"}
          </span>
        </>
      ) : (
        <div className="relative flex h-full w-full items-center justify-center">
          <div
            className={
              "absolute inset-0 rounded-full blur-md transition-opacity " +
              (isLight
                ? "bg-sky-300/60 opacity-70"
                : "bg-indigo-500/70 opacity-80")
            }
          />
          <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/80 border border-slate-700/70">
            <div
              className={
                "h-3.5 w-3.5 rounded-full border transition-colors " +
                (isLight
                  ? "border-sky-300 bg-sky-200/20"
                  : "border-indigo-400 bg-indigo-300/10")
              }
            />
          </div>
        </div>
      )}
    </button>
  );
}
