// seedDoctors.js
// Run: node seedDoctors.js
// This will populate your MongoDB doctors collection

import mongoose from "mongoose";

// 1. MongoDB connection
mongoose.connect("mongod://127.0.0.1:27017/Arogyamitra", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const doctorSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  hospital: String,
  experience: String,
  fee: String,
  source: String,
  city: String
});

const Doctor = mongoose.model("Doctor", doctorSchema);

// 2. Doctors Data (Nagpur)
const doctors = [
  // General Physicians/Internal Medicine
  { name: "Dr. Swarup P. Verma", specialty: "Internal Medicine", hospital: "Wockhardt Super Speciality Hospital, Shankar Nagar", experience: "17 साल", fee: "₹1000", source: "Practo", city: "Nagpur" },
  { name: "Dr. Nitin Wadaskar", specialty: "Internal Medicine", hospital: "Max Super Speciality Hospital, Mankapur", experience: "20 साल", fee: "₹750", source: "Practo", city: "Nagpur" },
  { name: "Dr. Nimaj Agarwal", specialty: "General Physician", hospital: "Max Super Speciality Hospital, Mankapur (+1 location)", experience: "13 साल", fee: "₹800", source: "Practo", city: "Nagpur" },
  { name: "Dr. Afzal Sheikh", specialty: "General Physician", hospital: "Nelson Hospital, Dhantoli", experience: "18 साल", fee: "₹800", source: "Practo", city: "Nagpur" },

  // Cardiology
  { name: "Dr. Nitin Tiwari", specialty: "Cardiologist", hospital: "Wockhardt Super Speciality Hospital, Shankar Nagar", experience: "28 साल", fee: "₹1000", source: "Practo", city: "Nagpur" },

  // Nephrology
  { name: "Dr. Suryashree Pandey", specialty: "Nephrologist", hospital: "Wockhardt Super Speciality Hospital, Shankar Nagar", experience: "27 साल", fee: "₹1000", source: "Practo", city: "Nagpur" },

  // Gastroenterology
  { name: "Dr. Piyush Marudwar", specialty: "Gastroenterologist", hospital: "Wockhardt Super Speciality Hospital, Shankar Nagar", experience: "16 साल", fee: "₹1200", source: "Practo", city: "Nagpur" },

  // Urology
  { name: "Dr. Shrikant Jai", specialty: "Urologist", hospital: "Wockhardt Super Speciality Hospital, Shankar Nagar (+1 location)", experience: "15 साल", fee: "₹1200", source: "Practo", city: "Nagpur" },

  // Gynecology
  { name: "Dr. Kadoo Priyanka Vijay", specialty: "Gynecologist / Obstetrician", hospital: "Birla Fertility & IVF, Sitabuldi", experience: "19 साल", fee: "₹800", source: "Practo", city: "Nagpur" },
  { name: "Dr. Dipti Shinde", specialty: "Gynecologist", hospital: "Wockhardt Super Speciality Hospital, Nagpur", experience: "15 साल", fee: "₹1000", source: "Credihealth", city: "Nagpur" },
  { name: "Dr. Riya Mangtani", specialty: "Gynecologist", hospital: "Wockhardt Super Speciality Hospital, Nagpur", experience: "11 साल", fee: "₹800", source: "Credihealth", city: "Nagpur" },

  // Oncology
  { name: "Dr. Shantanu S Pendse", specialty: "Oncologist", hospital: "HCG NCHRI Cancer Centre, Nagpur", experience: "9 साल", fee: "NA", source: "Credihealth", city: "Nagpur" },
  { name: "Dr. Nishad Dhakate", specialty: "Hemato-Oncologist", hospital: "HCG NCHRI Cancer Centre, Nagpur", experience: "9 साल", fee: "₹950", source: "Credihealth", city: "Nagpur" },
  { name: "Dr. Sushant Kumar", specialty: "Oncologist", hospital: "HCG NCHRI Cancer Centre, Nagpur", experience: "5 साल", fee: "₹800", source: "Credihealth", city: "Nagpur" },
  { name: "Dr. Ajay Mehta", specialty: "Surgical Oncologist", hospital: "HCG NCHRI Cancer Centre, Nagpur", experience: "36 साल", fee: "₹950", source: "Credihealth", city: "Nagpur" },

  // ENT
  { name: "Dr. Sidharth Saoji", specialty: "ENT Specialist", hospital: "Wockhardt Super Speciality Hospital, Nagpur", experience: "8 साल", fee: "₹800", source: "Credihealth", city: "Nagpur" },

  // Internal Medicine / Specialist (Other)
  { name: "Dr. Vaibhav Agarwal", specialty: "Internal Medicine", hospital: "CARE Hospital, Nagpur", experience: "15 साल", fee: "₹850", source: "Credihealth", city: "Nagpur" },
  { name: "Dr. Anand Kate", specialty: "Internal Medicine", hospital: "Wockhardt Super Speciality Hospital, Nagpur", experience: "13 साल", fee: "₹800", source: "Credihealth", city: "Nagpur" },

  // Orthopedics & Surgical
  { name: "Dr. Hemant Chhajed", specialty: "General Surgeon", hospital: "Wockhardt Super Speciality Hospital, Nagpur", experience: "24 साल", fee: "₹1000", source: "Credihealth", city: "Nagpur" },
  { name: "Dr. Priyesh Dhoke", specialty: "Spine Surgeon", hospital: "CARE Hospital, Nagpur", experience: "15 साल", fee: "NA", source: "Credihealth", city: "Nagpur" },

  // More (you can extend with AIIMS, CARE hospital, etc.)
];

// 3. Insert Data
async function seedData() {
  try {
    await Doctor.deleteMany({});
    await Doctor.insertMany(doctors);
    console.log("✅ Doctors data seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding data:", err);
  }
}

seedData();
