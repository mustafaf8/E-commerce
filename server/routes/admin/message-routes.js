const express = require('express');
const router = express.Router();
const { getAllMessages, replyToMessage, updateMessageStatus } = require('../../controllers/admin/message-controller');
const adminCheck = require('../../middleware/adminCheckMiddleware');

// GET /api/admin/messages
router.get('/', adminCheck, getAllMessages);

// POST /api/admin/messages/reply/:id
router.post('/reply/:id', adminCheck, replyToMessage);

// PUT /api/admin/messages/status/:id
router.put('/status/:id', adminCheck, updateMessageStatus);

module.exports = router;