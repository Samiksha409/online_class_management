import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authAPI } from "../services/api";

function Register() {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authAPI.register(
        formData.email,
        formData.username,
        formData.password,
        formData.first_name,
        formData.last_name
      );
      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex">

      <div className="w-1/2 bg-blue-50 flex items-center justify-center">

        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135789.png"
          className="w-80"
        />

      </div>

      <div className="w-1/2 flex items-center justify-center">

        <form
          onSubmit={handleRegister}
          className="bg-white p-10 rounded-2xl shadow-lg w-[450px]"
        >

          <h1 className="text-3xl font-bold mb-2">
            Create Account 🚀
          </h1>

          <p className="text-gray-500 mb-6">
            Create your account
          </p>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mb-4"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mb-4"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mb-4"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >

            {loading ? "Registering..." : "Register"}

          </button>

          <p className="mt-4 text-center">

            Already have account?

            <Link
              to="/"
              className="text-blue-600 ml-2"
            >
              Login
            </Link>

          </p>

        </form>

      </div>

    </div>
  );
}

export default Register;