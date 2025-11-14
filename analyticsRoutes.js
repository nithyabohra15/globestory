import express from 'express';
import { db } from '../server.js';
const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  const { destination, cost, happiness, type } = req.body;
  const [result] = await db.execute(
    'INSERT INTO analytics (destination, cost, happiness, type) VALUES (?, ?, ?, ?)',
    [destination, cost, happiness, type]
  );
  res.json({ id: result.insertId, destination, cost, happiness, type });
});

// READ
router.get('/', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM analytics');
  res.json(rows);
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { destination, cost, happiness, type } = req.body;
  const { id } = req.params;
  await db.execute(
    'UPDATE analytics SET destination=?, cost=?, happiness=?, type=? WHERE id=?',
    [destination, cost, happiness, type, id]
  );
  res.json({ message: 'Analytics entry updated' });
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.execute('DELETE FROM analytics WHERE id=?', [id]);
  res.json({ message: 'Analytics entry deleted' });
});

export default router;
