const fs = require('fs');

const db = JSON.parse(fs.readFileSync('seed-data.json', 'utf8'));

const AVAILABLE_SERVICES = [
  'Deep Home Cleaning', 'AC Installation & Repair', 'Pipe Leak Repair',
  'Electrical Fixes', 'Painting', 'Pest Control', 'Carpentry', 'Appliance Repair',
  'Master Plumber', 'House Cleaning', 'Electrician', 'Plumber',
  'AC Technician', 'Refrigerator Repair', 'Washing Machine Repair',
  'Microwave Repair', 'Television Repair', 'Water Purifier Service',
  'Home Appliance Installation', 'General Appliance Maintenance'
];

const AVAILABLE_LOCATIONS = [
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
  'Tirunelveli', 'Tiruppur', 'Erode', 'Vellore', 'Thoothukudi', 'Bangalore', 'Hyderabad'
];

// Let's filter out existing providers and create our own 500 per district
db.users = db.users.filter(u => u.role !== 'Provider');
db.services = [];

let providerIdCounter = 1;
AVAILABLE_LOCATIONS.forEach(location => {
  for (let i = 0; i < 500; i++) {
    const category = AVAILABLE_SERVICES[Math.floor(Math.random() * AVAILABLE_SERVICES.length)];
    const pid = `prov_${location}_${i}`;
    
    db.users.push({
      _id: pid,
      name: `Pro ${category} ${i}`,
      email: `pro${i}_${location.toLowerCase()}@example.com`,
      role: 'Provider',
      city: location,
      serviceArea: location,
      hourlyCharge: Math.floor(Math.random() * 500) + 200,
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(category)}&background=random`,
      averageRating: (Math.random() * 2 + 3).toFixed(1),
      reviewCount: Math.floor(Math.random() * 200)
    });
    
    db.services.push({
      _id: `srv_${location}_${i}`,
      title: `${category} in ${location}`,
      description: `Best ${category} service in ${location}. Reliable and professional.`,
      price: Math.floor(Math.random() * 1000) + 500,
      category: category,
      location: location,
      provider: pid,
      images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop"],
      createdAt: new Date().toISOString()
    });
  }
});

fs.writeFileSync('seed-data.json', JSON.stringify(db));
console.log('Seed data rewritten');
