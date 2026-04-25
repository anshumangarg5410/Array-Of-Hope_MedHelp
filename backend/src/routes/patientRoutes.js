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
      medications: trimmedMedicines.map(med => ({ medicineName: med })),
      issuedDate: new Date(),
    };

    patient.prescriptions.push(newPrescription);
    
    // Also push to currentMedications (avoiding exact duplicates)
    trimmedMedicines.forEach(med => {
      if (!patient.currentMedications.includes(med)) {
        patient.currentMedications.push(med);
      }
    });

    await patient.save();

    res.json({ message: "Prescription added successfully", patient });
  } catch (error) {
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
