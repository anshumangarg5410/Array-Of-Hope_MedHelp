const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/patients/me
// @desc    Get logged-in patient's full profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.userId).select('-password');
    if (!patient) {
      return res.status(404).json({ error: "Patient profile not found" });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

const aiService = require('../services/aiService');

// @route   POST /api/patients/me/prescriptions
// @desc    Add a manual prescription to the patient's profile
router.post('/me/prescriptions', authMiddleware, async (req, res) => {
  try {
    const { title, medicines } = req.body;
    
    if (!medicines) {
      return res.status(400).json({ error: "Medicines are required" });
    }

    const patient = await Patient.findById(req.user.userId);
    if (!patient) {
      return res.status(404).json({ error: "Patient profile not found" });
    }

    const trimmedMedicines = medicines
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    if (trimmedMedicines.length === 0) {
      return res.status(400).json({ error: "Medicines list cannot be empty" });
    }

    // Format for our database schema
    const newPrescription = {
      doctorName: "Manual Entry",
      diagnosis: title || "Manual Prescription Entry",
      medications: trimmedMedicines.map(med => ({ 
        medicineName: med,
        dosage: "As prescribed",
        duration: "As prescribed"
      })),
      issuedDate: new Date(),
    };

    // 1. RUN AI VALIDATION
    console.log("Running AI validation for manual entry...");
    const aiResult = await aiService.validatePrescription(newPrescription);
    console.log("AI Result:", aiResult.isSafe ? "SAFE" : "UNSAFE");

    // 2. SAVE IF SAFE (Optional: decide if we save even if unsafe. User wants to see if it's correct.)
    // For now, let's save it regardless but return the AI result so the UI can show the warning.
    patient.prescriptions.push(newPrescription);
    
    // Also push to currentMedications (avoiding exact duplicates)
    trimmedMedicines.forEach(medName => {
      const alreadyExists = patient.currentMedications.some(m => 
        m.medicineName.toLowerCase() === medName.toLowerCase()
      );
      if (!alreadyExists) {
        patient.currentMedications.push({ 
          medicineName: medName,
          dosage: "As prescribed",
          frequency: "As prescribed"
        });
      }
    });

    await patient.save();

    res.json({ 
      message: "Prescription added successfully", 
      patient,
      aiResult // Return the AI result to the frontend
    });
  } catch (error) {
    console.error("Manual prescription error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// @route   GET /api/patients
// @desc    Get all patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find({});
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
});

module.exports = router;
