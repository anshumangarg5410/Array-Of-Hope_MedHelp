const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');

// @route   POST /api/prescription/check
// @desc    Validate a hardcoded demo prescription using AI
router.post('/check', prescriptionController.checkPrescription);

module.exports = router;
