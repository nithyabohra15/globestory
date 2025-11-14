import express from 'express';
import { db } from '../server.js';
const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  try {
    const { category, budget, actual } = req.body;

    // Use safe defaults
    const safeCategory = category || 'Uncategorized';
    const safeBudget = budget || 0;
    const safeActual = actual || 0;

    const [result] = await db.execute(
      'INSERT INTO budget (category, budget, actual) VALUES (?, ?, ?)',
      [safeCategory, safeBudget, safeActual]
    );

    res.json({ id: result.insertId, category: safeCategory, budget: safeBudget, actual: safeActual });
  } catch (err) {
    console.error('❌ Error adding category:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM budget');
  res.json(rows);
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { category, budget, actual } = req.body;
  const { id } = req.params;
  await db.execute(
    'UPDATE budget SET category=?, budget=?, actual=? WHERE id=?',
    [category, budget, actual, id]
  );
  res.json({ message: 'Budget updated' });
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.execute('DELETE FROM budget WHERE id=?', [id]);
  res.json({ message: 'Budget deleted' });
});

export default router;
