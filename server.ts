import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routers
import authRoutes from './src/server/routes/authRoutes.js';
import serviceRoutes from './src/server/routes/serviceRoutes.js';
import bookingRoutes from './src/server/routes/bookingRoutes.js';
import adminRoutes from './src/server/routes/adminRoutes.js';
import reviewRoutes from './src/server/routes/reviewRoutes.js';
import userRoutes from './src/server/routes/userRoutes.js';

dotenv.config();

const distPath = path.join(process.cwd(), 'dist');

async function createServer() {
  const app = express();
  
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // Database Connection
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.warn('WARNING: MONGODB_URI is not defined in environment variables. Database features will not work.');
  } else if (MONGODB_URI.includes('user:pass@cluster.mongodb.net')) {
    console.warn('WARNING: MONGODB_URI is using the placeholder value. Please update it with your real MongoDB Atlas connection string. Database features will be simulated or disabled.');
  } else {
    mongoose.connect(MONGODB_URI)
      .then(() => console.log('Connected to MongoDB Atlas'))
      .catch((error) => console.error('MongoDB connection error:', error));
  }

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/users', userRoutes);

  // Serve Frontend
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Dev mode using Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

createServer();
