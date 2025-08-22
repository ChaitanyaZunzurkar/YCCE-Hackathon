// models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "pharmacist", "admin"],
      default: "patient",
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    // Only for doctors
    specialization: {
      type: String,
    },
    licenseNumber: {
      type: String,
    },
    // For patients
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    medicalHistory: [
      {
        condition: String,
        diagnosedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
