import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

// ✅ Initialize express app
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ MySQL Connection
export const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Riya2015',
  database: 'travel_app',
  port: 3306
});

try {
  await db.connect();
  console.log('✅ MySQL connected successfully');
} catch (err) {
  console.error('❌ MySQL connection failed:', err);
  process.exit(1);
}

// ✅ Test route
app.get('/', (req, res) => {
  res.send('🌍 Travel App Backend is Running!');
});

// ✅ Routes
import journalRoutes from './routes/journalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

app.use('/api/journal', journalRoutes);
app.use('/api/users', userRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/analytics', analyticsRoutes);

// ✅ Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));


