// server.js
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import hewanRoutes from './routes/hewanRoutes.js';
import akunRoutes from './routes/akunRoutes.js';
import pakanRoutes from './routes/pakanRoutes.js';
import produksiRoutes from './routes/produksiRoutes.js';
import kesehatanRoutes from './routes/kesehatanRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hewan', hewanRoutes);
app.use('/api/akun', akunRoutes);
app.use('/api/pakan', pakanRoutes);
app.use('/api/produksi', produksiRoutes);
app.use('/api/kesehatan', kesehatanRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
