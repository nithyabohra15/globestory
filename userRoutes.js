import express from 'express';
import { db } from '../server.js';
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    await db.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
    res.json({ message: 'User created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
  if (rows.length > 0) res.json({ message: 'Login successful' });
  else res.status(401).json({ error: 'Invalid credentials' });
});

export default router;
