import express from 'express';
import { db } from '../server.js';
const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  const { city, comment, image } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO journal (city, comment, image) VALUES (?, ?, ?)',
      [city, comment, image]
    );
    res.json({ id: result.insertId, city, comment, image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save entry' });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM journal ORDER BY date DESC');
  res.json(rows);
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { city, comment } = req.body;
  const { id } = req.params;
  await db.execute(
    'UPDATE journal SET city = ?, comment = ? WHERE id = ?',
    [city, comment, id]
  );
  res.json({ message: 'Journal entry updated' });
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.execute('DELETE FROM journal WHERE id = ?', [id]);
  res.json({ message: 'Journal entry deleted' });
});

export default router;
