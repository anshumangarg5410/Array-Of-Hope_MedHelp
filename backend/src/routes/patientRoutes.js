const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

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
