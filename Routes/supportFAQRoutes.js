// routes/supportFAQRoutes.js
const express = require('express');
const router = express.Router();
const supportFAQController = require('../Controller/supportFAQController');
const authMiddleware = require('../middleware/verifyToken');
const verifyUserRole = require('../middleware/verifyUserRole');

// Get all support info
router.get('/support', authMiddleware, verifyUserRole(['admin']), supportFAQController.getSupportInfo);

// Update support info
router.put('/support', authMiddleware, verifyUserRole(['admin']), supportFAQController.updateSupportInfo);

// Get all FAQs
router.get('/faqs', supportFAQController.getFAQs);

// Add a new FAQ
router.post('/faqs', authMiddleware, verifyUserRole(['admin']), supportFAQController.addFAQ);

// Delete a FAQ by ID
router.delete('/faqs/:id', authMiddleware, verifyUserRole(['admin']), supportFAQController.deleteFAQ);

module.exports = router;
