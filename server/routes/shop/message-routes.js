const express = require('express');
const router = express.Router();
const { getUserMessages } = require('../../controllers/shop/message-controller');
const { authMiddleware } = require('../../controllers/auth/auth-controller');

// GET /api/shop/messages
router.get('/', authMiddleware, getUserMessages);

module.exports = router;