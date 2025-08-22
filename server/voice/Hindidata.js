// seedDoctorsHindi.js
// Run: node seedDoctorsHindi.js
// यह स्क्रिप्ट MongoDB doctors collection में हिंदी डेटा डालेगी

import mongoose from "mongoose";

// 1. MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/medicaldb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const doctorSchema = new mongoose.Schema({
  naam: String,
  visheshagya: String,
  aspatal: String,
  anubhav: String,
  fees: String,
  srot: String,
  shahar: String
});

const Doctor = mongoose.model("DoctorHindi", doctorSchema);

// 2. Doctors Data (Hindi)
const doctors = [
  // General Physicians/Internal Medicine
  { naam: "डॉ. स्वरूप पी. वर्मा", visheshagya: "आंतरिक चिकित्सा", aspatal: "वॉकहार्ट सुपर स्पेशलिटी हॉस्पिटल, शंकर नगर", anubhav: "17 साल", fees: "₹1000", srot: "Practo", shahar: "नागपुर" },
  { naam: "डॉ. नितिन वडासकर", visheshagya: "आंतरिक चिकित्सा", aspatal: "मैक्स सुपर स्पेशलिटी हॉस्पिटल, माणकापुर", anubhav: "20 साल", fees: "₹750", srot: "Practo", shahar: "नागपुर" },
  { naam: "डॉ. निमज अग्रवाल", visheshagya: "जनरल फिजिशियन", aspatal: "मैक्स सुपर स्पेशलिटी हॉस्पिटल, माणकापुर", anubhav: "13 साल", fees: "₹800", srot: "Practo", shahar: "नागपुर" },
  { naam: "डॉ. अफजल शेख", visheshagya: "जनरल फिजिशियन", aspatal: "नेल्सन हॉस्पिटल, धंतोली", anubhav: "18 साल", fees: "₹800", srot: "Practo", shahar: "नागपुर" },

  // Cardiology
  { naam: "डॉ. नितिन तिवारी", visheshagya: "हृदय रोग विशेषज्ञ", aspatal: "वॉकहार्ट सुपर स्पेशलिटी हॉस्पिटल, शंकर नगर", anubhav: "28 साल", fees: "₹1000", srot: "Practo", shahar: "नागपुर" },

  // Gynecology
  { naam: "डॉ. काडू प्रियंका विजय", visheshagya: "स्त्री रोग / प्रसूति", aspatal: "बिरला फर्टिलिटी एंड आईवीएफ, सिताबुलदी", anubhav: "19 साल", fees: "₹800", srot: "Practo", shahar: "नागपुर" },
  { naam: "डॉ. दीप्ति शिंदे", visheshagya: "स्त्री रोग विशेषज्ञ", aspatal: "वॉकहार्ट सुपर स्पेशलिटी हॉस्पिटल, नागपुर", anubhav: "15 साल", fees: "₹1000", srot: "Credihealth", shahar: "नागपुर" },
  { naam: "डॉ. रिया मंगतानी", visheshagya: "स्त्री रोग विशेषज्ञ", aspatal: "वॉकहार्ट सुपर स्पेशलिटी हॉस्पिटल, नागपुर", anubhav: "11 साल", fees: "₹800", srot: "Credihealth", shahar: "नागपुर" },

  // Oncology
  { naam: "डॉ. शंतनु एस. पेंडसे", visheshagya: "कैंसर विशेषज्ञ", aspatal: "एचसीजी एनसीएचआरआई कैंसर सेंटर, नागपुर", anubhav: "9 साल", fees: "NA", srot: "Credihealth", shahar: "नागपुर" },
  { naam: "डॉ. निशाद धाकटे", visheshagya: "हीमेटो-ऑन्कोलॉजिस्ट", aspatal: "एचसीजी एनसीएचआरआई कैंसर सेंटर, नागपुर", anubhav: "9 साल", fees: "₹950", srot: "Credihealth", shahar: "नागपुर" },
  { naam: "डॉ. अजय मेहता", visheshagya: "सर्जिकल ऑन्कोलॉजिस्ट", aspatal: "एचसीजी एनसीएचआरआई कैंसर सेंटर, नागपुर", anubhav: "36 साल", fees: "₹950", srot: "Credihealth", shahar: "नागपुर" },

  // ENT
  { naam: "डॉ. सिद्धार्थ सोजी", visheshagya: "कान, नाक, गला विशेषज्ञ (ईएनटी)", aspatal: "वॉकहार्ट सुपर स्पेशलिटी हॉस्पिटल, नागपुर", anubhav: "8 साल", fees: "₹800", srot: "Credihealth", shahar: "नागपुर" }
];

// 3. Insert Data
async function seedData() {
  try {
    await Doctor.deleteMany({});
    await Doctor.insertMany(doctors);
    console.log("✅ हिंदी Doctors डेटा सफलतापूर्वक डाला गया!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding data:", err);
  }
}

seedData();


