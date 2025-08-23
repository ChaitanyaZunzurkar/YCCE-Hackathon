// src/pages/SignIn.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/authContext";

export default function SignIn() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signin", form);
      // backend returns { message, user, token }
      login({ user: data.user || data.result, token: data.token });
      nav("/", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold text-center text-black">Sign In</h2>

        {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}

      <form onSubmit={onSubmit} className="mt-6 space-y-4 text-black ">
  {/* Email Input */}
  <input
    className="w-full border border-gray-300 p-3 rounded-lg bg-white text-black focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-black placeholder-opacity-100 placeholder-font-bold"
    type="email"
    name="email"
    placeholder="Email"
    value={form.email}
    onChange={set}
  />

  {/* Password Input */}
  <input
    className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-black placeholder-opacity-100 placeholder-font-bold"
    type="password"
    name="password"
    placeholder="Password"
    value={form.password}
    onChange={set}
  />

  {/* Sign In Button */}
  <button
    disabled={loading}
    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-lg shadow-md hover:shadow-lg hover:shadow-blue-400/50 hover:scale-105 transition-all duration-300 disabled:opacity-50"
  >
    {loading ? "Signing in..." : "Sign In"}
  </button>

  {/* Optional Error */}
  {err && (
    <p className="text-red-600 text-sm text-center mt-2 transition-opacity duration-300">
      {err}
    </p>
  )}
</form>



        <p className="text-sm text-center mt-3 text-black font-semibold">
          New here? <Link to="/signup" className="text-blue-600">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
