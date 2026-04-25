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
        title: 'The Silent Architecture of Tomorrow',
        description: 'How AI is silently rebuilding the world around us through invisible systems.',
        content: `
          <p>The transition into the age of artificial intelligence hasn't happened with a bang, but with a series of quiet, persistent whispers. We often look for AI in humanoid robots or talking interfaces, but its most profound impact is in the "silent architecture"—the background systems that manage our power grids, optimize our logistics, and predict our needs before we even voice them.</p>
          <p>Imagine a city where traffic lights aren't on timers, but are living nodes in a neural network that breathes with the flow of commuters. Imagine a healthcare system where diagnosis starts months before symptoms appear, based on subtle shifts in metabolic data. This is not the future; it is the infrastructure currently being laid beneath our feet.</p>
          <h2>The Ethical Blueprint</h2>
          <p>As we build these systems, we must ask: who holds the keys to the architecture? Transparency in algorithmic decision-making is no longer a luxury; it is a fundamental requirement for a free society. If the foundations of our digital world are opaque, the structures we build upon them will always be unstable.</p>
          <p>In this deep dive, we explore the innovators who are prioritizing human-centric design in the most invisible of places. From energy-efficient data centers to bias-resistant hiring platforms, the architecture of tomorrow is being built today, one line of code at a time.</p>
        `,
        author: alice._id,
        isPremium: false,
        coverImage: '/ai.png',
        likes: 1240
      },
      {
        title: 'Echoes in the Emerald Thicket',
        description: 'A gripping short story of a researcher who discovers something ancient in the deep woods.',
        content: `
          <p>The mist in the Emerald Thicket was different today—heavier, smelling of wet earth and something metallic, like old coins. Elias adjusted his pack, the strap digging into his shoulder. He had been tracking the acoustic anomalies for three weeks, and today, the signal was finally clear.</p>
          <p>"Can you hear that?" he whispered into his recorder. The only response was the rhythmic drip of water from the canopy. But then, a low hum vibrated through his boots. It wasn't a sound; it was a physical presence, a frequency that shouldn't exist in a natural forest.</p>
          <blockquote>"The forest doesn't just have eyes; it has a heartbeat."</blockquote>
          <p>He pushed through a wall of ferns and stopped dead. In the center of a clearing stood a structure that defied every law of archaeology. It was seamless, made of a material that swallowed the light around it. It looked as if it had grown from the ground like a tree, yet its symmetry was mathematical, perfect, and terrifying.</p>
          <p>As Elias reached out to touch the cold, dark surface, the humming stopped. The forest went silent. And then, the door began to open.</p>
        `,
        author: alice._id,
        isPremium: true,
        coverImage: '/forest.png',
        likes: 852
      },
      {
        title: 'The Geometry of Focus',
        description: 'Finding clarity in a world of digital chaos through intentional minimalism.',
        content: `
          <p>We live in an era of "infinite scrolling," where the horizon of content is always receding. Our attention has become the most valuable commodity on Earth, and it is being harvested at an industrial scale. To fight back, we don't need faster devices; we need better boundaries.</p>
          <p>Minimalism is often misunderstood as an aesthetic of emptiness. In reality, it is an aesthetic of <strong>essentialism</strong>. It is the process of stripping away the "noise" so that the "signal" can finally be heard. When we clear our desks, we are really clearing our minds.</p>
          <ul>
            <li><strong>Digital Fasting:</strong> Set specific hours where screens are forbidden.</li>
            <li><strong>Monotasking:</strong> Focus on one deep task for 90 minutes.</li>
            <li><strong>Curated Inputs:</strong> Be as selective with your information as you are with your food.</li>
          </ul>
          <p>Clarity is a choice. By designing our physical and digital spaces with intention, we create a sanctuary for deep work and genuine reflection. The geometry of focus is not about the space we leave empty, but about the quality of the life we put into the space that remains.</p>
        `,
        author: bob._id,
        isPremium: false,
        coverImage: '/minimalist.png',
        likes: 450
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
