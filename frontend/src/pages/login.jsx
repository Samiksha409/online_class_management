import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authAPI } from "../services/api";

function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ FIX: send object with username & password
      const response = await authAPI.login({
        username: email,   // 🔥 important fix
        password: password,
      });

      // Save tokens
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      // Navigate properly (no full reload needed)
      navigate("/dashboard");

    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);

      // Show backend error if available
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex">

      {/* Left Side */}
      <div className="w-1/2 bg-blue-50 flex items-center justify-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
          alt="login"
          className="w-80"
        />
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex items-center justify-center">

        <form
          onSubmit={handleLogin}
          className="bg-white p-10 rounded-2xl shadow-lg w-[450px]"
        >

          <h1 className="text-3xl font-bold mb-2">
            Welcome Back 👋
          </h1>

          <p className="text-gray-500 mb-6">
            Login to your account
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4"
            required
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-4 text-center">
            Don't have account?
            <Link to="/register" className="text-blue-600 ml-2">
              Register
            </Link>
          </p>

        </form>

      </div>

    </div>
  );
}

export default Login;