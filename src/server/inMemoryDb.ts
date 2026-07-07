import fs from 'fs';
import path from 'path';

export let db = {
  users: [] as any[],
  services: [] as any[],
  bookings: [] as any[],
  reviews: [] as any[],
  favorites: [] as any[],
  notifications: [] as any[]
};

try {
  const data = fs.readFileSync(path.join(process.cwd(), 'seed-data.json'), 'utf8');
  db = JSON.parse(data);
  
  if (!db.services) db.services = [];
  if (!db.bookings) db.bookings = [];
  if (!db.reviews) db.reviews = [];
  
  if (db.services.length === 0 && db.users && db.users.length > 0) {
    const providers = db.users.filter((u: any) => u.role === 'Provider');
    providers.forEach((provider: any, index: number) => {
      const categories = [
        'AC Technician', 'Refrigerator Repair', 'Plumber', 'Electrician', 
        'House Cleaning', 'Painting', 'Appliance Repair', 'Deep Home Cleaning',
        'Pipe Leak Repair', 'Electrical Fixes', 'Pest Control', 'Carpentry', 'Master Plumber'
      ];
      const category = provider.category || categories[index % categories.length];
      db.services.push({
        _id: `service_${index}`,
        title: `Professional ${category}`,
        description: `Expert ${category} with years of experience. Providing top-quality service.`,
        price: provider.hourlyCharge || Math.floor(Math.random() * 1000) + 500,
        category: category,
        location: provider.city || provider.serviceArea || 'Chennai',
        provider: provider._id || provider,
        images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop"],
        createdAt: new Date().toISOString()
      });
    });
  }
} catch (e) {
  console.error('Could not load seed-data.json', e);
}
