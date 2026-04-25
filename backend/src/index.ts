import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './db';

import authRoutes from './routes/auth';
import storyRoutes from './routes/stories';
import checkoutRoutes from './routes/checkout';
import webhookRoutes from './routes/webhook';

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());

// Webhook requires raw body for signature verification
app.use('/api/webhook/stripe', express.raw({ type: 'application/json' }), webhookRoutes);

// Common JSON parser
app.use(express.json({ limit: '50mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/checkout', checkoutRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
