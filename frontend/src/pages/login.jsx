import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaGraduationCap, FaLock, FaUser } from "react-icons/fa";
import { authAPI } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login({ username, password });
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      window.dispatchEvent(new Event("ocms:auth"));
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.code === "ERR_NETWORK") {
        setError("Cannot reach API. Start Django on port 8000 and check VITE_API_BASE_URL.");
      } else {
        setError("Invalid username or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/80 via-slate-950 to-slate-950" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col lg:flex-row">
        <div className="flex flex-1 flex-col justify-center px-8 py-14 lg:px-12 lg:py-20">
          <div className="mb-10 inline-flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <FaGraduationCap className="text-2xl text-indigo-200" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-300">
                ClassHub
              </p>
              <p className="text-lg font-semibold text-white">
                Online Class Management
              </p>
            </div>
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Run your campus classes with clarity.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-slate-300">
            One place for courses, timetables, assignments, and student records —
            built for a realistic final-year project with Django REST + MySQL +
            JWT.
          </p>
          <ul className="mt-10 space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Role-based access: Admin, Teacher, Student
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              REST APIs + secure token authentication
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              MySQL-backed relational data model
            </li>
          </ul>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-16 pt-4 lg:px-10 lg:py-20">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">Sign in</h2>
            <p className="mt-1 text-sm text-slate-400">
              Use your <span className="text-slate-200">username</span>, not email.
            </p>

            {error && (
              <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Username
                <div className="relative mt-1.5">
                  <FaUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    autoComplete="username"
                    placeholder="e.g. student1"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-3 pl-10 pr-3 text-sm text-white outline-none ring-indigo-500/0 transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/30"
                    required
                  />
                </div>
              </label>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Password
                <div className="relative mt-1.5">
                  <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/30"
                    required
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-indigo-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              New to ClassHub?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-300 hover:text-indigo-200"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
