import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Customer', 'Provider', 'Admin'], default: 'Customer' },
  
  // Shared profile
  phoneNumber: { type: String },
  address: { type: String },
  city: { type: String },
  area: { type: String },
  pincode: { type: String },
  profileImage: { type: String },
  
  // Provider specific
  category: { type: String },
  experience: { type: Number },
  serviceArea: { type: String },
  description: { type: String },
  availability: { type: String },
  hourlyCharge: { type: Number },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
