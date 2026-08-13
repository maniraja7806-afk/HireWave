import express from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { db } from '../inMemoryDb.js';
import { protect, AuthRequest } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        totalUsers: db.users.length,
        totalProviders: db.users.filter(u => u.role === 'Provider').length,
        totalCustomers: db.users.filter(u => u.role === 'Customer').length,
        totalBookings: db.bookings.length,
        totalServices: db.services.length
      });
    }
    const totalUsers = await User.countDocuments();
    const totalProviders = await User.countDocuments({ role: 'Provider' });
    const totalCustomers = await User.countDocuments({ role: 'Customer' });
    res.json({ totalUsers, totalProviders, totalCustomers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/providers', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const providers = db.users.filter(u => u.role === 'Provider').map(p => ({
        _id: p._id,
        name: p.name,
        username: p.username,
        email: p.email,
        category: p.category,
        city: p.city,
        phoneNumber: p.phoneNumber,
        isVerified: p.isVerified,
        createdAt: p.createdAt
      }));
      return res.json(providers);
    }
    const providers = await User.find({ role: 'Provider' }).select('-password');
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/providers/:id/reset-password', async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    const tempPassword = newPassword || `Reset@${Math.floor(Math.random()*90000+10000)}`;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    if (mongoose.connection.readyState !== 1) {
      const provider = db.users.find(u => u._id.toString() === id);
      if (!provider) return res.status(404).json({ message: 'Provider not found' });
      provider.password = hashedPassword;
      return res.json({ message: 'Password reset successfully', newPassword: tempPassword, username: provider.username });
    }

    const provider = await User.findById(id);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    provider.password = hashedPassword;
    await provider.save();

    res.json({ message: 'Password reset successfully', newPassword: tempPassword, username: provider.username });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.delete('/providers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      db.users = db.users.filter(u => u._id.toString() !== id);
      return res.json({ message: 'Provider deleted successfully' });
    }
    await User.findByIdAndDelete(id);
    res.json({ message: 'Provider deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
