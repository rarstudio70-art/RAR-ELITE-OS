import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backend = "https://api.rar-eliteos.studio";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${backend}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.detail || "Login failed.");
      }

      if (!data.access_token) {
        throw new Error("No token returned from server.");
      }

      // unified membership token
      localStorage.setItem("rar_auth_token", data.access_token);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="w-full max-w-md p-6 rounded-xl border border-slate-800 bg-slate-900/70 backdrop-blur">
        <h1 className="text-2xl font-bold mb-4 text-cyan-300">
          Log in to RAR Elite OS
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-400 border border-red-500/50 rounded px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm outline-none focus:border-cyan-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm outline-none focus:border-cyan-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-sm transition-all ${
              loading
                ? "bg-cyan-700 cursor-wait"
                : "bg-cyan-600 hover:bg-cyan-500"
            }`}
          >
            {loading ? "Authenticating..." : "Log in & Enter OS"}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-400">
          Need an account?{" "}
          <Link
            to="/register"
            className="text-cyan-400 hover:text-cyan-300 underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}