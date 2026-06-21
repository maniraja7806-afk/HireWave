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
} catch (e) {
  console.error('Could not load seed-data.json', e);
}
