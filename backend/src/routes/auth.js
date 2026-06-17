const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

router.get('/', (req, res) => {
  res.json({ message: 'Auth route works!' });
});

router.post('/register', async (req, res) => {
  try {
    const { register } = require('../controllers/authController');
    return register(req, res);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { login } = require('../controllers/authController');
    return login(req, res);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;