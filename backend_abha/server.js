/**
 * ABDM/ABHA Demo Backend (Mock Sandbox)
 * Express server exposing a minimal flow to demo your USP:
 * 1) Create ABHA (mock)  2) Link/Verify  3) Fetch Health Records  4) Emergency QR
 * NOTE: This uses MOCK data so you can demo without real credentials.
 * Later, swap mocks with ABDM Sandbox APIs.
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

const app = express();
app.use(cors());
app.use(express.json());

/** In-memory mock database */
const users = new Map(); // key: abhaId, value: { linked: bool, profile: {...}, records: {...} }

/** Health record templates (mock) */
function makeMockRecords(abhaId) {
  return {
    abhaId,
    summary: {
      name: "Asha Devi",
      age: 38,
      bloodGroup: "B+",
      chronicConditions: ["Type 2 Diabetes"],
      allergies: ["Penicillin"],
      lastUpdated: new Date().toISOString()
    },
    prescriptions: [
      { date: "2025-07-01", medicines: ["Metformin 500mg"], doctor: "Dr. Rao (MD, Medicine)" },
      { date: "2025-04-14", medicines: ["Vitamin D3 60k IU weekly"], doctor: "Dr. Gupta (MBBS)" }
    ],
    labs: [
      { date: "2025-06-20", test: "HbA1c", value: "8.1%", flag: "HIGH" },
      { date: "2025-06-20", test: "Fasting Glucose", value: "156 mg/dL", flag: "HIGH" }
    ],
    immunizations: [
      { vaccine: "Td Booster", date: "2024-12-10" }
    ]
  };
}

/**
 * POST /api/abha/create
 * Body: { aadhaar, lastName, yearOfBirth, gender, mobile }
 * Returns: { txnId, abhaId }
 */
app.post('/api/abha/create', (req, res) => {
  const { aadhaar, lastName, yearOfBirth, gender, mobile } = req.body || {};
  if (!aadhaar || !lastName || !yearOfBirth || !gender || !mobile) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const txnId = uuidv4();
  const abhaId = `${lastName.toLowerCase()}-${yearOfBirth}-${strpad(Math.floor(Math.random()*9999),4)}`;
  if (!users.has(abhaId)) {
    users.set(abhaId, {
      linked: false,
      profile: { aadhaar, lastName, yearOfBirth, gender, mobile },
      records: makeMockRecords(abhaId)
    });
  }
  return res.json({ txnId, abhaId, message: "ABHA created in mock sandbox. Please verify OTP to link." });
});

/**
 * POST /api/abha/link
 * Body: { abhaId, otp }
 * Returns: { linked: true }
 */
app.post('/api/abha/link', (req, res) => {
  const { abhaId, otp } = req.body || {};
  if (!abhaId || !otp) return res.status(400).json({ error: "abhaId & otp required" });
  const user = users.get(abhaId);
  if (!user) return res.status(404).json({ error: "ABHA not found" });
  // Mock OTP check: accept any 6-digit otp
  if (!/^\d{6}$/.test(String(otp))) return res.status(400).json({ error: "Invalid OTP format" });
  user.linked = true;
  return res.json({ linked: true, message: "ABHA linked successfully (mock)" });
});

/**
 * GET /api/abha/records?abhaId=...
 * Returns: { records }
 */
app.get('/api/abha/records', (req, res) => {
  const { abhaId } = req.query;
  if (!abhaId) return res.status(400).json({ error: "abhaId required" });
  const user = users.get(abhaId);
  if (!user) return res.status(404).json({ error: "ABHA not found" });
  if (!user.linked) return res.status(403).json({ error: "ABHA not linked/verified" });
  return res.json({ records: user.records });
});

/**
 * GET /api/abha/emergency-card?abhaId=...
 * Returns: { qrDataUrl, essentials }
 */
app.get('/api/abha/emergency-card', async (req, res) => {
  const { abhaId } = req.query;
  if (!abhaId) return res.status(400).json({ error: "abhaId required" });
  const user = users.get(abhaId);
  if (!user) return res.status(404).json({ error: "ABHA not found" });
  const essentials = {
    abhaId,
    name: user.records.summary.name,
    bloodGroup: user.records.summary.bloodGroup,
    allergies: user.records.summary.allergies,
    emergencyContact: user.profile.mobile
  };
  const qrPayload = JSON.stringify(essentials);
  try {
    const qrDataUrl = await QRCode.toDataURL(qrPayload);
    return res.json({ qrDataUrl, essentials });
  } catch (e) {
    return res.status(500).json({ error: "QR generation failed", details: e.message });
  }
});

/** Helper */
function strpad(n, width) {
  const s = n.toString();
  return s.length >= width ? s : new Array(width - s.length + 1).join('0') + s;
}

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ ABDM Mock Backend running on http://localhost:${PORT}`);
});
