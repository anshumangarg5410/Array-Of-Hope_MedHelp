const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// @route   POST /api/chat
// @desc    Patient-aware AI Chatbot
router.post('/', chatController.handleChat);

module.exports = router;
