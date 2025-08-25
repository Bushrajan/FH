import express from 'express';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnection from '../config/db.js';
import authRoutes from '../routes/auth.js';
import adminRoutes from '../routes/adminRoutes.js';
import uploadFile from '../routes/common.js';
import userRoutes from '../routes/userRoutes.js';
import hijabRoutes from '../routes/hijabRoute.js';
import reviewRoutes from '../routes/reviewRoutes.js';

dotenv.config();

const app = express();

// Connect to DB before handling requests
dbConnection();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/auth', adminRoutes);
app.use('/api/upload', uploadFile);
app.use('/api/reviews', reviewRoutes);
app.use('/api/hijab', hijabRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Complete Server Deployment!' });
});

// ✅ Vercel expects a default export
export default serverless(app);
