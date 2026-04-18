import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { isAdminActive } from "../admin";

export default function ApiKeyPage() {
  const [apiKey, setApiKey] = useState("");
  const [usage, setUsage] = useState(null);
  const [lastUsed, setLastUsed] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [showKey, setShowKey] = useState(false);
  const [loadingAction, setLoadingAction] = useState("");

  const backend = "https://api.rar-eliteos.studio";
  const navigate = useNavigate();
  const adminActive = isAdminActive();

  const notify = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
    if (text) {
      setTimeout(() => setMessage(""), 3500);
    }
  };

  const persistKey = (key) => {
    if (key) {
      localStorage.setItem("rar_api_key", key);
    }
  };

  const getAuthToken = () => {
    const token = localStorage.getItem("rar_auth_token");
    if (!token || token.trim().length < 10) {
      if (!adminActive) {
        notify("Membership inactive. Activate unified bundle first.", "error");
        navigate("/dashboard");
        return null;
      }
    }
    return token;
  };

  const handleRequest = async (fn, label) => {
    try {
      const token = getAuthToken();
      if (!token && !adminActive) return;
      setLoadingAction(label);
      await fn(token);
    } catch (err) {
      notify("Request failed. Check backend / network.", "error");
    } finally {
      setLoadingAction("");
    }
  };

  const createKey = () =>
    handleRequest(async (token) => {
      const res = await fetch(`${backend}/api/key/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await res.json();
      if (data.api_key) {
        setApiKey(data.api_key);
        persistKey(data.api_key);
        notify("API key created / retrieved.", "success");
        navigate("/dashboard");
      } else {
        notify("No key returned from server.", "error");
      }
    }, "create");

  const getInfo = () =>
    handleRequest(async (token) => {
      const res = await fetch(`${backend}/api/key/info`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) {
        notify("No active key found for this account.", "error");
        return;
      }
      const data = await res.json();
      setApiKey(data.api_key);
      setUsage(data.usage_count);
      setLastUsed(data.last_used);
      setCreatedAt(data.created_at);
      persistKey(data.api_key);
      notify("API key info loaded.", "success");
    }, "info");

  const regenerate = () =>
    handleRequest(async (token) => {
      const res = await fetch(`${backend}/api/key/regenerate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await res.json();
      if (data.api_key) {
        setApiKey(data.api_key);
        setUsage(0);
        setLastUsed(null);
        persistKey(data.api_key);
        notify("API key regenerated.", "success");
      } else {
        notify("Failed to regenerate key.", "error");
      }
    }, "regen");

  const revoke = () =>
    handleRequest(async (token) => {
      const res = await fetch(`${backend}/api/key/revoke`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) {
        notify("No active key to revoke.", "error");
        return;
      }
      setApiKey("");
      setUsage(null);
      setLastUsed(null);
      setCreatedAt(null);
      localStorage.removeItem("rar_api_key");
      notify("API key revoked.", "success");
    }, "revoke");

  const copyKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    notify("API key copied to clipboard.", "success");
  };

  const maskedKey = useMemo(() => {
    if (!apiKey) return "";
    if (showKey) return apiKey;
    if (apiKey.length <= 8) return "••••••••";
    return `${apiKey.slice(0, 4)}••••••••${apiKey.slice(-4)}`;
  }, [apiKey, showKey]);

  const usageBars = useMemo(() => {
    const count = typeof usage === "number" ? usage : 0;
    const capped = Math.min(count, 20);
    return Array.from({ length: 20 }).map((_, i) => i < capped);
  }, [usage]);

  const messageColor =
    messageType === "error"
      ? "text-red-400 border-red-500/60 bg-red-900/10"
      : messageType === "success"
      ? "text-emerald-400 border-emerald-500/60 bg-emerald-900/10"
      : "text-cyan-300 border-cyan-500/60 bg-cyan-900/10";

  const buttonBase =
    "px-4 py-2 rounded border border-cyan-500/40 text-xs tracking-wide uppercase " +
    "transition-all duration-150 shadow-[0_0_12px_rgba(0,255,255,0.25)] " +
    "hover:shadow-[0_0_24px_rgba(0,255,255,0.55)] hover:-translate-y-[1px] " +
    "disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="relative min-h-screen bg-black text-cyan-100 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#00f5ff33,_transparent_55%),radial-gradient(circle_at_bottom,_#7b3fffd9,_transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(#0f172a33_1px,transparent_1px),linear-gradient(90deg,#0f172a33_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-soft-light bg-[repeating-linear-gradient(to_bottom,rgba(0,255,255,0.15)_0px,rgba(0,255,255,0.15)_1px,transparent_1px,transparent_3px)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-cyan-400/80 uppercase tracking-[0.25em]">
              RAR ELITE OS // ACCESS LAYER
            </div>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-cyan-50">
              API Key Control Node
            </h1>
            <p className="mt-2 text-sm text-cyan-200/70 max-w-xl">
              Issue, rotate, and revoke API credentials for your RAR Elite OS
              cluster. All traffic is gated through this access layer.
            </p>
            {adminActive && (
              <p className="mt-2 text-xs text-emerald-300/80 font-mono">
                ADMIN MODE ACTIVE — API key checks are bypassed for you, but
                still enforced for users.
              </p>
            )}
          </div>
          <div className="hidden md:flex flex-col items-end text-right font-mono text-[11px] text-cyan-300/70">
            <span className="px-3 py-1 border border-cyan-500/60 rounded-full bg-cyan-500/10">
              STATUS: <span className="text-emerald-400">ONLINE</span>
            </span>
            <span className="mt-2">NODE: /apikey</span>
            <span>MODE: CYBER-TERMINAL</span>
          </div>
        </div>

        <div className="grid md:grid-cols-[2fr,1.4fr] gap-6">
          <div className="relative rounded-xl border border-cyan-500/40 bg-slate-950/70 backdrop-blur-md shadow-[0_0_40px_rgba(0,255,255,0.25)] overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-400/60 to-transparent" />

            <div className="px-5 pt-4 pb-3 border-b border-cyan-500/30 flex items-center justify-between">
              <div className="font-mono text-xs text-cyan-300">
                ACCESS CHANNEL // ACCOUNT BOUND
              </div>
              <div className="flex gap-2 text-[10px] font-mono text-cyan-400/80">
                <span className="px-2 py-0.5 border border-cyan-500/40 rounded-full">
                  AUTH: API_KEY
                </span>
                <span className="px-2 py-0.5 border border-cyan-500/40 rounded-full">
                  STORAGE: SQLITE
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                <button
                  className={`${buttonBase} ${
                    loadingAction === "create"
                      ? "bg-cyan-500/20"
                      : "bg-cyan-500/10"
                  }`}
                  onClick={createKey}
                  disabled={!!loadingAction}
                >
                  {loadingAction === "create" ? "Processing..." : "Create / Get"}
                </button>
                <button
                  className={`${buttonBase} ${
                    loadingAction === "info"
                      ? "bg-emerald-500/20"
                      : "bg-emerald-500/10"
                  }`}
                  onClick={getInfo}
                  disabled={!!loadingAction}
                >
                  {loadingAction === "info" ? "Loading..." : "Sync Info"}
                </button>
                <button
                  className={`${buttonBase} ${
                    loadingAction === "regen"
                      ? "bg-amber-500/20"
                      : "bg-amber-500/10"
                  }`}
                  onClick={regenerate}
                  disabled={!!loadingAction}
                >
                  {loadingAction === "regen" ? "Rotating..." : "Regenerate"}
                </button>
                <button
                  className={`${buttonBase} ${
                    loadingAction === "revoke"
                      ? "bg-rose-500/20"
                      : "bg-rose-500/10"
                  }`}
                  onClick={revoke}
                  disabled={!!loadingAction}
                >
                  {loadingAction === "revoke" ? "Revoking..." : "Revoke"}
                </button>
              </div>

              {message && (
                <div
                  className={`mt-2 rounded border px-3 py-2 text-xs font-mono ${messageColor}`}
                >
                  {message}
                </div>
              )}

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-mono text-cyan-300/80">
                    ACTIVE API KEY
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <button
                      className="px-2 py-0.5 rounded border border-cyan-500/40 text-cyan-200/80 hover:bg-cyan-500/10 transition"
                      onClick={() => setShowKey((v) => !v)}
                      disabled={!apiKey}
                    >
                      {showKey ? "Hide" : "Reveal"}
                    </button>
                    <button
                      className="px-2 py-0.5 rounded border border-cyan-500/40 text-cyan-200/80 hover:bg-cyan-500/10 transition"
                      onClick={copyKey}
                      disabled={!apiKey}
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="rounded border border-cyan-500/40 bg-black/70 px-3 py-2 font-mono text-xs text-cyan-100 min-h-[40px] flex items-center">
                  {apiKey ? maskedKey : "No active key bound to this account."}
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-xl border border-cyan-500/40 bg-slate-950/80 backdrop-blur-md shadow-[0_0_40px_rgba(123,63,255,0.35)] overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/80 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-fuchsia-400/60 to-transparent" />

            <div className="px-5 pt-4 pb-3 border-b border-fuchsia-500/30 flex items-center justify-between">
              <div className="font-mono text-xs text-fuchsia-300">
                USAGE TELEMETRY // LIVE SNAPSHOT
              </div>
              <div className="text-[10px] font-mono text-fuchsia-300/80">
                STREAM: /api/chat
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-fuchsia-200/80">
                  <span>REQUEST LOAD</span>
                  <span>
                    {typeof usage === "number" ? usage : 0} calls tracked
                  </span>
                </div>
                <div className="h-20 rounded border border-fuchsia-500/40 bg-black/70 px-2 py-2 flex items-end gap-[3px] overflow-hidden">
                  {usageBars.map((active, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 rounded-t ${
                        active
                          ? "bg-gradient-to-t from-fuchsia-500 to-cyan-400"
                          : "bg-slate-800/60"
                      } transition-all duration-200`}
                      style={{
                        height: active ? `${40 + (idx % 5) * 8}%` : "10%",
                      }}
                    />
                  ))}
                </div>
                <div className="text-[10px] font-mono text-fuchsia-300/70 mt-1">
                  Bars represent relative usage density (capped at 20). Higher
                  bars = heavier recent load.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] font-mono text-cyan-200/80">
                <div className="space-y-1">
                  <div className="text-cyan-400/80">CREATED AT</div>
                  <div className="rounded border border-cyan-500/30 bg-black/70 px-2 py-1 min-h-[32px] flex items-center">
                    {createdAt || "—"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-cyan-400/80">LAST USED</div>
                  <div className="rounded border border-cyan-500/30 bg-black/70 px-2 py-1 min-h-[32px] flex items-center">
                    {lastUsed || "—"}
                  </div>
                </div>
              </div>

              <div className="mt-2 rounded border border-cyan-500/30 bg-black/70 px-3 py-2 text-[10px] font-mono text-cyan-300/80">
                <div className="text-cyan-400/90 mb-1">
                  INTEGRATION NOTES // RAR ELITE OS
                </div>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Attach this key as{" "}
                    <span className="text-emerald-400">X-API-Key</span> on all
                    chat requests.
                  </li>
                  <li>
                    Unified + single‑AI modes both respect this access layer.
                  </li>
                  <li>
                    Revoking a key instantly severs access across the cluster.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}