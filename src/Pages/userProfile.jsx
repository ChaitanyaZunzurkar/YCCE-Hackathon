import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("token"); 

  useEffect(() => {
    axios
      .get("/api/user", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setUser(res.data);
        setFormData(res.data);
      })
      .catch((err) => console.error(err));
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    axios
      .put("/api/user", formData, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setUser(res.data.user);
        setEditMode(false);
        alert(res.data.message);
      })
      .catch((err) => console.error(err));
  };

  // Delete account
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      axios
        .delete("/api/user", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          alert(res.data.message);
          localStorage.removeItem("token");
          window.location.href = "/signin"; // redirect to login
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <h2>User Profile</h2>

      {editMode ? (
        <div>
          <label>Name:</label>
          <input name="name" value={formData.name || ""} onChange={handleChange} />

          <label>Email:</label>
          <input name="email" value={formData.email || ""} onChange={handleChange} />

          {user.role === "doctor" && (
            <>
              <label>Specialization:</label>
              <input
                name="specialization"
                value={formData.specialization || ""}
                onChange={handleChange}
              />

              <label>License Number:</label>
              <input
                name="licenseNumber"
                value={formData.licenseNumber || ""}
                onChange={handleChange}
              />
            </>
          )}

          {user.role === "patient" && (
            <>
              <label>Age:</label>
              <input name="age" value={formData.age || ""} onChange={handleChange} />

              <label>Gender:</label>
              <select name="gender" value={formData.gender || ""} onChange={handleChange}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </>
          )}

          <label>Phone:</label>
          <input name="phone" value={formData.phone || ""} onChange={handleChange} />

          <label>Address:</label>
          <input name="address" value={formData.address || ""} onChange={handleChange} />

          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.role === "doctor" && (
            <>
              <p><strong>Specialization:</strong> {user.specialization}</p>
              <p><strong>License Number:</strong> {user.licenseNumber}</p>
            </>
          )}
          {user.role === "patient" && (
            <>
              <p><strong>Age:</strong> {user.age}</p>
              <p><strong>Gender:</strong> {user.gender}</p>
            </>
          )}
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Address:</strong> {user.address}</p>

          <button onClick={() => setEditMode(true)}>Edit Profile</button>
          <button onClick={handleDelete} style={{ color: "red" }}>
            Delete Account
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
