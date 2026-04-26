import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nuvoice';

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error. Make sure your MONGODB_URI in backend/.env is correct and your database is reachable.');
    console.error('Error details:', error instanceof Error ? error.message : error);
    if (process.env.NODE_ENV === 'production') process.exit(1);
  }
}
