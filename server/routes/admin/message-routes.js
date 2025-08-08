const express = require('express');
const router = express.Router();
const { getAllMessages, replyToMessage, updateMessageStatus } = require('../../controllers/admin/message-controller');
const adminCheck = require('../../middleware/adminCheckMiddleware');
const permissionCheck = require('../../middleware/permissionCheckMiddleware');

// GET /api/admin/messages
router.get('/', adminCheck, permissionCheck('messages', 'view'), getAllMessages);

// POST /api/admin/messages/reply/:id
router.post('/reply/:id', adminCheck, permissionCheck('messages', 'manage'), replyToMessage);

// PUT /api/admin/messages/status/:id
router.put('/status/:id', adminCheck, permissionCheck('messages', 'manage'), updateMessageStatus);

module.exports = router;