// src/components/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";

export default function UserDashboard() {
  const { token } = useAuth(); // get token from AuthContext
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // Fetch user profile
  const fetchUser = async () => {
    try {
      if (!token) return; // no token, don't fetch
      const res = await axios.get("http://localhost:5000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]); // fetch when token changes

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Update profile
  const handleUpdate = async () => {
    try {
      const res = await axios.put("/api/user/me", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setEditMode(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  // Delete account
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      await axios.delete("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Account deleted successfully");
      window.location.href = "/login"; // redirect after delete
    } catch (err) {
      console.error(err);
      alert("Failed to delete account");
    }
  };

  if (!user) return <div className="p-6 text-center text-black">Loading user details...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">User Dashboard</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setEditMode(!editMode)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-black">Personal Info</h2>
          {editMode ? (
            <>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1 text-black" placeholder="Name" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1 text-black" placeholder="Email" />
              <input type="text" name="phone" value={formData.phone || ""} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1 text-black" placeholder="Phone" />
              <input type="text" name="address" value={formData.address || ""} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1 text-black" placeholder="Address" />
              <input type="number" name="age" value={formData.age || ""} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1 text-black" placeholder="Age" />
              <select name="gender" value={formData.gender || ""} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1 text-black">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone || "-"}</p>
              <p><strong>Address:</strong> {user.address || "-"}</p>
              <p><strong>Age:</strong> {user.age || "-"}</p>
              <p><strong>Gender:</strong> {user.gender || "-"}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </>
          )}
        </div>

        {/* Doctor Info */}
        {user.role === "doctor" && (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-black">Doctor Info</h2>
            {editMode ? (
              <>
                <input type="text" name="specialization" value={formData.specialization || ""} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1 text-black" placeholder="Specialization" />
                <input type="text" name="licenseNumber" value={formData.licenseNumber || ""} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1 text-black" placeholder="License Number" />
              </>
            ) : (
              <>
                <p><strong>Specialization:</strong> {user.specialization || "-"}</p>
                <p><strong>License Number:</strong> {user.licenseNumber || "-"}</p>
              </>
            )}
          </div>
        )}

        {/* Medical History */}
        {user.role === "patient" && (
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-2 text-black">Medical History</h2>
            {user.medicalHistory && user.medicalHistory.length > 0 ? (
              <ul className="list-disc pl-5 text-black">
                {user.medicalHistory.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.condition}</strong> (Diagnosed: {new Date(item.diagnosedAt).toLocaleDateString()})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No medical history found.</p>
            )}
          </div>
        )}
      </div>

      {editMode && (
        <div className="flex justify-end mt-4">
          <button onClick={handleUpdate} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Save Changes
          </button>
        </div>
      )}

      <div className="flex justify-center mt-6">
        <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Delete Account
        </button>
      </div>
    </div>
  );
}
