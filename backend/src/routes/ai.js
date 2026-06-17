const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { chat, recommend } = require('../controllers/aiController');

// Chat public — sans auth
router.post('/chat', chat);

// Recommandations personnalisées — avec auth
router.post('/recommend', auth, recommend);

module.exports = router;