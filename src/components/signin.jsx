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
      nav("/chat", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>

        {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <input className="w-full border p-2 rounded" type="email" name="email" placeholder="Email" value={form.email} onChange={set} />
          <input className="w-full border p-2 rounded" type="password" name="password" placeholder="Password" value={form.password} onChange={set} />
          <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center mt-3">
          New here? <Link to="/signup" className="text-blue-600">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
