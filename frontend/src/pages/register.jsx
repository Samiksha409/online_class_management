import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaGraduationCap } from "react-icons/fa";
import { authAPI } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    role: "student",
    roll_number: "",
    employee_id: "",
    department: "",
    program: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = { ...formData };
    if (payload.role === "student") {
      payload.employee_id = "";
    }
    if (payload.role === "teacher") {
      payload.roll_number = "";
    }

    try {
      await authAPI.register(payload);
      navigate("/", { replace: true });
    } catch (err) {
      const data = err.response?.data;
      if (typeof data === "object" && data) {
        const msg = Object.entries(data)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join(" · ");
        setError(msg || "Registration failed.");
      } else {
        setError("Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-violet-900/70 via-slate-950 to-slate-950" />

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-col px-6 py-12 sm:py-16">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-indigo-300 hover:text-indigo-200"
        >
          ← Back to sign in
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <FaGraduationCap className="text-xl text-violet-200" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
              ClassHub
            </p>
            <h1 className="text-xl font-bold text-white">Create your account</h1>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                name="first_name"
                placeholder="First name"
                value={formData.first_name}
                onChange={handleChange}
                className="rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/30"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last name"
                value={formData.last_name}
                onChange={handleChange}
                className="rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/30"
              />
            </div>
            <input
              type="text"
              name="username"
              placeholder="Username *"
              value={formData.username}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/30"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/30"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 chars) *"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/30"
              required
              minLength={6}
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/30"
            >
              <option value="student">Register as Student</option>
              <option value="teacher">Register as Teacher</option>
            </select>

            {formData.role === "student" && (
              <>
                <input
                  type="text"
                  name="roll_number"
                  placeholder="Roll number *"
                  value={formData.roll_number}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/30"
                  required
                />
                <input
                  type="text"
                  name="program"
                  placeholder="Program (e.g. B.Tech CSE)"
                  value={formData.program}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/30"
                />
              </>
            )}

            {formData.role === "teacher" && (
              <>
                <input
                  type="text"
                  name="employee_id"
                  placeholder="Employee ID *"
                  value={formData.employee_id}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/30"
                  required
                />
                <input
                  type="text"
                  name="department"
                  placeholder="Department *"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/30"
                  required
                />
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-violet-500 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-400 disabled:opacity-50"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/" className="font-semibold text-violet-300 hover:text-violet-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
