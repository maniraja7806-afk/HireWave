import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fakerEN_IN as faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from './models/User.js';
import { Service } from './models/Service.js';
import { Booking } from './models/Booking.js';
import { Review } from './models/Review.js';
import { Favorite } from './models/Favorite.js';
import { Notification } from './models/Notification.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CATEGORIES = [
  'AC Technician',
  'Refrigerator Repair',
  'Washing Machine Repair',
  'Microwave Repair',
  'Television Repair',
  'Water Purifier Service',
  'Electrician',
  'Plumber',
  'Home Appliance Installation',
  'General Appliance Maintenance'
];

async function seed() {
  try {
    console.log('Generating seed data locally...');
    const MONGODB_URI = process.env.MONGODB_URI;
    let isMongoConnected = false;

    if (MONGODB_URI && !MONGODB_URI.includes('user:pass')) {
      try {
        await mongoose.connect(MONGODB_URI);
        isMongoConnected = true;
        console.log('Connected to MongoDB Atlas for seeding.');
        await User.deleteMany({});
        await Service.deleteMany({});
        await Booking.deleteMany({});
        await Review.deleteMany({});
        await Favorite.deleteMany({});
        await Notification.deleteMany({});
        console.log('Cleared existing MongoDB data.');
      } catch (err) {
        console.error('Failed to connect to MongoDB Atlas:', err);
      }
    } else {
       console.log('Skipping MongoDB connection (no valid MONGODB_URI).');
    }

    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    console.log('Generating Admin...');
    const admin = {
      _id: new mongoose.Types.ObjectId(),
      name: 'HireWave Admin',
      username: 'admin',
      email: 'admin@hirewave.com',
      password: defaultPassword,
      role: 'Admin',
      phoneNumber: faker.phone.number(),
      city: 'New York',
      profileImage: faker.image.avatar(),
      createdAt: new Date()
    };

    console.log('Generating 10 Customers...');
    const customers = [];
    for (let i = 0; i < 10; i++) {
      customers.push({
        _id: new mongoose.Types.ObjectId(),
        name: faker.person.fullName(),
        username: `customer_${i+1}_${Math.floor(Math.random()*900+100)}`,
        email: faker.internet.email(),
        password: defaultPassword,
        role: 'Customer',
        phoneNumber: faker.phone.number(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        profileImage: faker.image.avatar(),
        createdAt: new Date()
      });
    }

    const TN_DISTRICTS = [
      'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode',
      'Vellore', 'Thanjavur', 'Dindigul', 'Kanchipuram', 'Karur', 'Namakkal', 'Cuddalore',
      'Thoothukudi', 'Virudhunagar', 'Kanniyakumari', 'Krishnagiri', 'Dharmapuri', 'Sivagangai',
      'Ramanathapuram', 'Ariyalur', 'Perambalur', 'Tenkasi', 'Nilgiris', 'Tiruppur', 'Mayiladuthurai',
      'Ranipet', 'Tirupathur', 'Chengalpattu', 'Kallakurichi', 'Nagapattinam', 'Pudukottai',
      'Villupuram', 'Thiruvarur'
    ];

    const TAMIL_FIRST_NAMES = [
      'Karthik', 'Suresh', 'Ramesh', 'Saravanan', 'Vijay', 'Ajith', 'Surya', 'Dhanush', 
      'Siva', 'Muthu', 'Murugan', 'Venkatesh', 'Bala', 'Arun', 'Prakash', 'Prabhu', 
      'Manikandan', 'Anand', 'Gopi', 'Vignesh', 'Dinesh', 'Ashok', 'Senthil', 'Ravi', 
      'Kumaran', 'Hari', 'Kishore', 'Rajesh', 'Sathish', 'Mohan', 'Sanjay', 'Vasant',
      'Priya', 'Kavitha', 'Meena', 'Lakshmi', 'Radha', 'Revathi', 'Chitra', 'Bhavani',
      'Nandhini', 'Anitha', 'Divya', 'Ramya', 'Nithya', 'Shalini', 'Gayathri', 'Geetha'
    ];

    const TAMIL_LAST_NAMES = [
      'Kumar', 'Raj', 'Nathan', 'Swamy', 'Rajan', 'Sekar', 'Krishnan', 'Ram', 
      'Pandian', 'Chander', 'Srinivasan', 'Murthy', 'Raman', 'Ganesan', 'Mani'
    ];

    console.log(`Generating Providers for ${TN_DISTRICTS.length} TN Districts (4 per district = 140+ providers)...`);
    const providers = [];
    const providerCredentialsList = [];

    for (const district of TN_DISTRICTS) {
      for (let i = 0; i < 4; i++) {
        const category = faker.helpers.arrayElement(CATEGORIES);
        const firstName = faker.helpers.arrayElement(TAMIL_FIRST_NAMES);
        const lastName = faker.helpers.arrayElement(TAMIL_LAST_NAMES);
        const providerName = `${firstName} ${lastName}`;
        
        const username = `prov_${district.toLowerCase().replace(/[^a-z0-9]/g, '')}_${i+1}_${Math.floor(Math.random()*9000+1000)}`;
        const plainPassword = `Pass@${district.substring(0,3)}${i+1}#${Math.floor(Math.random()*900+100)}`;
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${district.toLowerCase().replace(/[^a-z]/g, '')}${i+1}_${Math.floor(Math.random()*900+100)}@example.com`;

        providerCredentialsList.push({
          name: providerName,
          category,
          city: district,
          username,
          password: plainPassword
        });

        providers.push({
          _id: new mongoose.Types.ObjectId(),
          name: providerName,
          username,
          email,
          password: hashedPassword,
          role: 'Provider',
          category: category,
          phoneNumber: faker.phone.number(),
          address: faker.location.streetAddress(),
          area: faker.location.street(),
          city: district,
          pincode: faker.location.zipCode('6#####'),
          isVerified: true,
          experience: faker.number.int({ min: 1, max: 15 }),
          serviceArea: `${district} and surrounding areas`,
          description: `Professional ${category} with years of experience in ${district}.`,
          availability: 'Mon-Sat, 9AM-6PM',
          hourlyCharge: faker.number.int({ min: 150, max: 1200 }),
          profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(providerName)}&background=random&color=fff&size=150`,
          averageRating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
          reviewCount: faker.number.int({ min: 10, max: 150 }),
          createdAt: new Date()
        });
      }
    }

    console.log(`Generating ${providers.length} Services (1 per provider)...`);
    const services = providers.map(p => ({
      _id: new mongoose.Types.ObjectId(),
      provider: p._id,
      title: `${p.name}'s ${p.category} Services`,
      description: p.description,
      category: p.category,
      price: p.hourlyCharge,
      duration: '1 hour',
      location: p.city,
      createdAt: new Date()
    }));

    console.log('Generating 500 Bookings...');
    const bookings = [];
    const statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    for (let i = 0; i < 500; i++) {
      const customer = faker.helpers.arrayElement(customers);
      const service = faker.helpers.arrayElement(services);
      const provider = providers.find(p => p._id.toString() === service.provider.toString());
      
      bookings.push({
        _id: new mongoose.Types.ObjectId(),
        customer: customer._id,
        provider: provider?._id,
        service: service._id,
        date: faker.date.future(),
        status: faker.helpers.arrayElement(statuses),
        createdAt: new Date()
      });
    }

    console.log('Generating 500 Reviews...');
    const reviews = [];
    for (let i = 0; i < 500; i++) {
       const customer = faker.helpers.arrayElement(customers);
       const provider = faker.helpers.arrayElement(providers);
       reviews.push({
         _id: new mongoose.Types.ObjectId(),
         customer: customer._id,
         provider: provider._id,
         rating: faker.number.int({ min: 3, max: 5 }),
         comment: faker.lorem.sentences(2),
         createdAt: new Date()
       });
    }

    console.log('Generating 50 Favorites...');
    const favorites = [];
    for (let i = 0; i < 50; i++) {
        const customer = faker.helpers.arrayElement(customers);
        const provider = faker.helpers.arrayElement(providers);
        favorites.push({
          _id: new mongoose.Types.ObjectId(),
          customer: customer._id,
          provider: provider._id,
          createdAt: new Date()
        });
    }

    console.log('Generating 100 Notifications...');
    const notifications = [];
    const allUsers = [admin, ...customers, ...providers];
    for (let i = 0; i < 100; i++) {
        const user = faker.helpers.arrayElement(allUsers);
        notifications.push({
          _id: new mongoose.Types.ObjectId(),
          user: user._id,
          title: 'System Notification',
          message: faker.lorem.sentence(),
          read: faker.datatype.boolean(),
          createdAt: new Date()
        });
    }

    console.log('Saving provider-credentials.csv...');
    let csvContent = "Provider Name | Service Category | City | Username | Password\n";
    providerCredentialsList.forEach(p => {
      csvContent += `${p.name} | ${p.category} | ${p.city} | ${p.username} | ${p.password}\n`;
    });
    fs.writeFileSync(path.join(__dirname, '../../provider-credentials.csv'), csvContent);
    fs.writeFileSync(path.join(__dirname, '../../provider-credentials.json'), JSON.stringify(providerCredentialsList, null, 2));
    console.log('Saved provider-credentials.csv and provider-credentials.json successfully.');

    console.log('Saving all data to seed-data.json...');
    const exportData = {
      users: [admin, ...customers, ...providers],
      services: services,
      bookings: bookings,
      reviews: reviews,
      favorites: favorites,
      notifications: notifications
    };
    fs.writeFileSync(path.join(__dirname, '../../seed-data.json'), JSON.stringify(exportData));
    console.log('Saved to seed-data.json.');

    if (isMongoConnected) {
      console.log('Saving data to MongoDB Atlas...');
      const chunkSize = 1000;
      console.log(`Inserting ${exportData.users.length} users...`);
      for (let i = 0; i < exportData.users.length; i += chunkSize) {
        await User.insertMany(exportData.users.slice(i, i + chunkSize));
        console.log(`  Inserted ${Math.min(i + chunkSize, exportData.users.length)} / ${exportData.users.length} users`);
      }
      console.log(`Inserting ${exportData.services.length} services...`);
      for (let i = 0; i < exportData.services.length; i += chunkSize) {
        await Service.insertMany(exportData.services.slice(i, i + chunkSize));
        console.log(`  Inserted ${Math.min(i + chunkSize, exportData.services.length)} / ${exportData.services.length} services`);
      }
      await Booking.insertMany(exportData.bookings);
      await Review.insertMany(exportData.reviews);
      await Favorite.insertMany(exportData.favorites);
      await Notification.insertMany(exportData.notifications);
      console.log('Saved to MongoDB Atlas successfully.');
      await mongoose.disconnect();
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
