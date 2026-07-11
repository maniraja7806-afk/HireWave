import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import { User } from './src/server/models/User.js';
import { Service } from './src/server/models/Service.js';
import { Booking } from './src/server/models/Booking.js';
import { Review } from './src/server/models/Review.js';

dotenv.config();

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('No MONGODB_URI');
    return;
  }
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
  
  const dbData = JSON.parse(fs.readFileSync('seed-data.json', 'utf8'));
  
  console.log('Clearing existing DB...');
  await User.deleteMany({});
  await Service.deleteMany({});
  await Booking.deleteMany({});
  await Review.deleteMany({});
  
  console.log(`Inserting ${dbData.users.length} users...`);
  // Convert _id strings to ObjectIds for MongoDB, or let Mongoose handle if schema allows string _id. Wait, Mongoose models usually use ObjectId for _id unless overridden. Let's see the schema.
  // Wait, if _id in seed data are strings like "prov_Chennai_0", mongoose will throw error if the schema expects ObjectId.
}
seed();
