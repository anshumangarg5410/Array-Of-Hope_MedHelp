const aiService = require('../services/aiService');
const Patient = require('../models/Patient');

const demoPrescription = {
  doctorName: "Dr. Amit Verma",
  diagnosis: "Type 2 Diabetes + Hypertension + Pain",
  medications: [
    { medicineName: "Metformin", dosage: "500mg", duration: "30 days" },
    { medicineName: "Ibuprofen", dosage: "400mg", duration: "10 days" },
    { medicineName: "Lisinopril", dosage: "10mg", duration: "30 days" },
    { medicineName: "Spironolactone", dosage: "25mg", duration: "30 days" },
    { medicineName: "Potassium Supplements", dosage: "20mEq", duration: "30 days" }
  ],
  issuedDate: "2024-04-01T10:00:00.000Z",
  validTill: "2024-05-01T10:00:00.000Z"
};

exports.checkPrescription = async (req, res) => {
  try {
    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({ error: "patientId is required in the request body" });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    console.log("====================================");
    console.log("Sending demo prescription to Groq AI for validation...");

    const aiResult = await aiService.validatePrescription(demoPrescription);
    
    console.log("AI Result received:", aiResult);

    // 5. IF safe -> store in MongoDB
    // 6. IF unsafe -> DO NOT store
    if (aiResult.isSafe === true) {
      patient.prescriptions.push(demoPrescription);
      await patient.save();
      console.log("✅ Prescription marked SAFE and saved to patient record.");
    } else {
      console.log("❌ Prescription marked UNSAFE. Database was NOT modified.");
    }
    console.log("====================================");

    return res.json(aiResult);

  } catch (error) {
    console.error("Error in prescription controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
