import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import User from './models/User';
import Story from './models/Story';

// Load env explicitly
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env');
    process.exit(1);
  }

  console.log('Connecting to:', MONGODB_URI.substring(0, 20) + '...');

  try {
    // Standardize connection options
    await mongoose.connect(MONGODB_URI, {
      connectTimeoutMS: 10000,
    });
    console.log('✅ Connected to DB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Story.deleteMany({});
    console.log('Cleared existing data.');

    // Create Dummy Users
    const passwordHash = await bcrypt.hash('password123', 10);
    
    const alice = await User.create({
      name: 'Alice Writer',
      email: 'alice@example.com',
      passwordHash,
      isPremium: true
    });

    const bob = await User.create({
      name: 'Bob Reader',
      email: 'bob@example.com',
      passwordHash,
      isPremium: false
    });

    console.log('Created dummy users.');

    // Create Dummy Stories
    await Story.create([
      {
        title: 'The Future of AI',
        description: 'An exploration of how artificial intelligence will shape our next decade.',
        content: 'Artificial intelligence is no longer a thing of the future. It is here, transforming industries from healthcare to finance. In this essay, we look at the ethical implications and the vast potential for creative collaboration between humans and machines...',
        author: alice._id,
        isPremium: false,
        likes: 120
      },
      {
        title: 'A Night in Tokyo (Premium)',
        description: 'A fictional short story about a mysterious encounter in Shinjuku.',
        content: 'The neon lights of Shinjuku reflected off the damp pavement. Kenji adjusted his collar, the cool mist of the midnight rain settling on his skin. He was late for the meeting at Golden Gai, a meeting that would change his life forever...',
        author: alice._id,
        isPremium: true,
        likes: 85
      },
      {
        title: 'The Art of Minimalist Living',
        description: 'Practical tips for decluttering your home and your mind.',
        content: 'Minimalism isn\'t just about owning less stuff. It\'s about making room for more life. By removing the physical and mental clutter that distracts us, we can focus on the things that truly matter: relationships, experiences, and personal growth...',
        author: bob._id, // Bob decided to write one too
        isPremium: false,
        likes: 45
      }
    ]);

    console.log('✅ Successfully seeded dummy stories.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
