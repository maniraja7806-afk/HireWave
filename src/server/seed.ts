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
    console.log('Generating seed data locally (skipping DB connection due to network config)...');
    
    // We will use mongoose.Types.ObjectId() directly to generate IDs
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    console.log('Generating Admin...');
    const admin = {
      _id: new mongoose.Types.ObjectId(),
      name: 'HireWave Admin',
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

    console.log(`Generating Providers for ${TN_DISTRICTS.length} TN Districts (35 per district)...`);
    const providers = [];
    for (const district of TN_DISTRICTS) {
      for (let i = 0; i < 35; i++) {
        const category = faker.helpers.arrayElement(CATEGORIES);
        const firstName = faker.helpers.arrayElement(TAMIL_FIRST_NAMES);
        const lastName = faker.helpers.arrayElement(TAMIL_LAST_NAMES);
        const providerName = `${firstName} ${lastName}`;
        
        providers.push({
          _id: new mongoose.Types.ObjectId(),
          name: providerName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
          password: defaultPassword,
          role: 'Provider',
          category: category,
          phoneNumber: faker.phone.number(),
          address: faker.location.streetAddress(),
          area: faker.location.street(),
          city: district, // ensure search hits
          pincode: faker.location.zipCode('6#####'), // TN pincodes typically start with 6
          isVerified: faker.datatype.boolean({ probability: 0.85 }), // 85% verified
          experience: faker.number.int({ min: 1, max: 15 }),
          serviceArea: `${district} and surrounding areas`,
          description: (() => {
            const exp = faker.number.int({ min: 1, max: 15 });
            const years = exp > 1 ? `${exp} years` : '1 year';
            switch (category) {
              case 'AC Technician': return `Professional AC Technician with ${years} of experience in ${district}. Specializing in AC installation, repair, gas filling, and routine maintenance for all major brands including Voltas, LG, and Daikin. Prompt service and guaranteed satisfaction.`;
              case 'Refrigerator Repair': return `Expert refrigerator repair specialist operating in ${district} for over ${years}. Proficient in fixing cooling issues, compressor replacement, gas leak repair, and thermostat issues for single-door, double-door, and side-by-side fridges.`;
              case 'Washing Machine Repair': return `Experienced washing machine technician with ${years} of expertise in ${district}. I provide reliable repair services for front-load, top-load, and semi-automatic machines of all major brands. I handle issues ranging from drum noise to drainage problems.`;
              case 'Microwave Repair': return `Skilled microwave repair technician based in ${district} with ${years} of experience. Offering fast and reliable diagnostics, magnetron repairs, keypad replacements, and general servicing for convection and solo microwaves.`;
              case 'Television Repair': return `Professional TV repair expert serving ${district}. With ${years} of experience, I specialize in repairing LED, LCD, OLED, and Smart TVs. Services include panel replacement, backlight repair, and motherboard-level troubleshooting.`;
              case 'Water Purifier Service': return `Certified water purifier technician in ${district} with ${years} of handling RO, UV, and UF systems. Providing complete servicing, filter replacement, membrane cleaning, and installation to ensure your drinking water is 100% safe.`;
              case 'Electrician': return `Licensed and experienced electrician available in ${district} for over ${years}. I handle all types of residential and commercial electrical work including wiring, switchboard installation, inverter setup, and fault finding. Safety and quality guaranteed.`;
              case 'Plumber': return `Reliable plumbing professional with ${years} of service in ${district}. Capable of fixing leaks, unclogging drains, installing water heaters, taps, and full bathroom fittings. Prompt response for emergency plumbing issues.`;
              case 'Home Appliance Installation': return `Expert home appliance installer with ${years} of experience in ${district}. I provide safe and professional installation services for TVs, washing machines, ACs, and other major home appliances. Ensuring your devices are set up correctly the first time.`;
              case 'General Appliance Maintenance': return `Your trusted partner for general appliance maintenance in ${district}. With ${years} of experience, I provide comprehensive preventive maintenance for all household appliances, expanding their lifespan and optimizing performance.`;
              default: return `Professional service provider in ${district} with ${years} of experience. Dedicated to delivering high-quality, reliable, and prompt solutions for your home appliance needs. Customer satisfaction is my top priority.`;
            }
          })(),
          availability: 'Mon-Sat, 9AM-6PM',
          hourlyCharge: faker.number.int({ min: 150, max: 1200 }), // realistic prices in INR
          profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(providerName)}&background=random&color=fff&size=150`,
          averageRating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
          reviewCount: faker.number.int({ min: 10, max: 150 }),
          createdAt: new Date()
        });
      }
    }

    console.log('Generating 100 Services (1 per provider)...');
    const services = providers.map(p => ({
      _id: new mongoose.Types.ObjectId(),
      provider: p._id,
      title: `${p.name}'s ${p.category} Services`,
      description: p.description,
      category: p.category,
      price: p.hourlyCharge,
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

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
