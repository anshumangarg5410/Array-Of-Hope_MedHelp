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
