import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { initAuth } from './services/passport.js';
import path from 'path';
import { fileURLToPath } from 'url';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import searchRoutes from './routes/searchRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

//  Middleware
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://learnato-forum-381650529713.us-central1.run.app'
      : 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());


// Passport Middleware
app.use(passport.initialize());

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

initAuth();


// Routes 
app.use('/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);


if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  const clientBuildPath = path.resolve(__dirname, '../public'); // Fixed path
  
  app.use(express.static(clientBuildPath));
  
  // Use a function without a wildcard route pattern
  app.use((req, res, next) => {
    // Skip API and auth routes
    if (req.path.startsWith('/api/') || req.path.startsWith('/auth/')) {
      return next();
    }
    
    // Serve index.html for all other routes (SPA fallback)
    res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
      if (err) {
        res.status(500).send('Error loading application');
      }
    });
  });
}

app.get('/', (req, res) => {
  res.send('Learnato Forum API is running...');
});

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();