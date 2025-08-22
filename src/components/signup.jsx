// src/pages/SignUp.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/authContext";

const MEDICAL_OPTIONS = ["diabetes", "hypertension", "asthma", "allergies"];

export default function SignUp() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    phone: "",
    address: "",
    // patient
    age: "",
    gender: "",
    medicalHistory: [],
    // doctor
    specialization: "",
    licenseNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const toggleMedical = (cond) => {
    setForm((f) => {
      const has = f.medicalHistory.includes(cond);
      const next = has ? f.medicalHistory.filter((c) => c !== cond) : [...f.medicalHistory, cond];
      return { ...f, medicalHistory: next };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
        try {
            const payload = {
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
            phone: form.phone || undefined,
            address: form.address || undefined,
            age: form.role === "patient" && form.age ? Number(form.age) : undefined,
            gender: form.role === "patient" ? form.gender || undefined : undefined,
            medicalHistory:
                form.role === "patient"
                ? form.medicalHistory.map((c) => ({ condition: c }))
                : undefined,
            specialization: form.role === "doctor" ? form.specialization || undefined : undefined,
            licenseNumber: form.role === "doctor" ? form.licenseNumber || undefined : undefined,
            };

            const { data } = await api.post("/auth/signup", payload);
            login({ user: data.user, token: data.token });

            // Navigate to home page instead of /chat
            nav("/", { replace: true }); 
        } catch (e) {
            setErr(e?.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };


  return (
   <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50 p-4 overflow-x-hidden">
  <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-lg">
    <h2 className="text-2xl font-bold text-center text-black mb-6">Create Account</h2>

    {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

    <form onSubmit={onSubmit} className="space-y-4 text-black">
      {/* Name */}
      <input
        className="w-full border border-gray-300 p-3 rounded-lg bg-white text-black placeholder-black focus:bg-white focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-font-bold"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={set}
      />

      {/* Email */}
      <input
        className="w-full border border-gray-300 p-3 rounded-lg bg-white text-black placeholder-black focus:bg-white focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-font-bold"
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={set}
      />

      {/* Password */}
      <input
        className="w-full border border-gray-300 p-3 rounded-lg bg-white text-black placeholder-black focus:bg-white focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-font-bold"
        type="password"
        name="password"
        placeholder="Password (min 6 chars)"
        value={form.password}
        onChange={set}
      />

      {/* Role + Phone */}
      <div className="grid grid-cols-2 gap-2">
        <select
          className="border p-3 rounded-lg bg-white text-black focus:bg-white focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          name="role"
          value={form.role}
          onChange={set}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="pharmacist">Pharmacist</option>
        </select>
        <input
          className="border p-3 rounded-lg bg-white text-black placeholder-black focus:bg-white focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          name="phone"
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={set}
        />
      </div>

      {/* Address */}
      <input
        className="w-full border p-3 rounded-lg bg-white text-black placeholder-black focus:bg-white focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        name="address"
        placeholder="Address (optional)"
        value={form.address}
        onChange={set}
      />

      {/* Patient fields */}
      {form.role === "patient" && (
        <div className="rounded-lg p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input
              className="border p-3 rounded-lg bg-white text-black placeholder-black focus:bg-white focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              type="number"
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={set}
            />
            <select
              className="border p-3 rounded-lg bg-white text-black focus:bg-white focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              name="gender"
              value={form.gender}
              onChange={set}
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      )}

      {/* Doctor fields */}
      {form.role === "doctor" && (
        <div className="border rounded-lg p-3 grid grid-cols-1 gap-2">
          <input
            className="border p-3 rounded-lg bg-white text-black placeholder-black focus:bg-white focus:text-black focus:ring-2 focus:ring-blue-00 focus:border-blue-500 transition"
            name="specialization"
            placeholder="Specialization (e.g., General Physician)"
            value={form.specialization}
            onChange={set}
          />
          <input
            className="border p-3 rounded-lg bg-white text-black placeholder-black focus:bg-white focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            name="licenseNumber"
            placeholder="Medical Registration Number"
            value={form.licenseNumber}
            onChange={set}
          />
        </div>
      )}

      <button
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-bold transition"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>
    </form>

    <p className="text-sm text-center mt-3 text-black">
      Already have an account? <Link to="/signin" className="text-blue-600 hover:underline">Sign In</Link>
    </p>
  </div>
</div>

  );
}
