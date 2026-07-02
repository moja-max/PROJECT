import { connectDB } from './config/database.js';
import seedDatabase from './seedDatabase.js';
import dotenv from 'dotenv';

dotenv.config();

const runSeed = async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log('Seed completed');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

runSeed();
