// server.js (Node + Express)
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// MongoDB connect
mongoose.connect("mongodb://localhost:27017/medicaldb");

// Schema models
const Symptom = mongoose.model("Symptom", new mongoose.Schema({
  keyword: String,
  description: String
}));

const Doctor = mongoose.model("Doctor", new mongoose.Schema({
  name: String,
  specialty: String,
  hospital: String,
  experience: String,
  fee: String,
  city: String
}));

// Query API
app.post("/api/query", async (req, res) => {
  const { query } = req.body;

  // 1. Check symptoms
  const symptom = await Symptom.findOne({ keyword: { $regex: query, $options: "i" } });
  if (symptom) {
    return res.json({ type: "symptom", response: symptom.description });
  }

  // 2. Check doctors
  const doctors = await Doctor.find({ specialty: { $regex: query, $options: "i" }, city: "Nagpur" });
  if (doctors.length > 0) {
    return res.json({
      type: "doctors",
      response: doctors.map(d => `${d.name} - ${d.specialty}, ${d.hospital}, अनुभव: ${d.experience}, Fee: ${d.fee}`)
    });
  }

  res.json({ type: "none", response: "Maaf kijiye, mujhe is vishay ke baare me jankari nahi hai." });
});

// Start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
