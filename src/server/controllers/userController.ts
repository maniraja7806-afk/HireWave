import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Review } from '../models/Review.js';
import { Service } from '../models/Service.js';
import { db } from '../inMemoryDb.js';

export const getProviderProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      const provider = db.users.find(u => u._id.toString() === id);
      if (!provider || provider.role !== 'Provider') {
        return res.status(404).json({ message: 'Provider not found' });
      }
      
      const reviews = db.reviews.filter(r => r.provider.toString() === id || r.provider?._id?.toString() === id);
      
      // Let's populate the customer details in reviews manually for in memory DB
      const populatedReviews = reviews.map(r => {
        const c = db.users.find(u => u._id.toString() === (r.customer._id ? r.customer._id.toString() : r.customer.toString()));
        return {
          ...r,
          customer: c ? { _id: c._id, name: c.name, profileImage: c.profileImage } : r.customer
        };
      });

      const services = db.services.filter(s => s.provider.toString() === id || s.provider?._id?.toString() === id);

      // Generate some mock portfolio images if none exist
      let portfolioImages = provider.portfolioImages;
      if (!portfolioImages || portfolioImages.length === 0) {
        portfolioImages = [
           "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop",
           "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop",
           "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop"
        ];
      }

      return res.json({
        ...provider,
        portfolioImages,
        reviews: populatedReviews,
        services
      });
    }

    const provider = await User.findById(id).select('-password');
    if (!provider || provider.role !== 'Provider') {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const reviews = await Review.find({ provider: id }).populate('customer', 'name profileImage').sort({ createdAt: -1 });
    const services = await Service.find({ provider: id });
    
    let portfolioImages = (provider as any).portfolioImages;
    if (!portfolioImages || portfolioImages.length === 0) {
      portfolioImages = [
         "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop",
         "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop",
         "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop"
      ];
    }

    res.json({
      ...provider.toObject(),
      portfolioImages,
      reviews,
      services
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

import { AuthRequest } from '../middleware/authMiddleware.js';

export const toggleFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    if (mongoose.connection.readyState !== 1) {
      const user = db.users.find(u => u._id.toString() === userId);
      if (!user) return res.json([]);
      
      if (!user.favorites) user.favorites = [];
      const index = user.favorites.findIndex((favId: string) => favId.toString() === id);
      
      if (index === -1) {
        user.favorites.push(id);
      } else {
        user.favorites.splice(index, 1);
      }
      return res.json({ favorites: user.favorites });
    }

    const user = await User.findById(userId);
    if (!user) return res.json([]);

    const favorites = user.favorites || [];
    const index = favorites.indexOf(id as any);
    
    if (index === -1) {
      favorites.push(id as any);
    } else {
      favorites.splice(index, 1);
    }
    
    user.favorites = favorites;
    await user.save();
    
    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    if (mongoose.connection.readyState !== 1) {
      const user = db.users.find(u => u._id.toString() === userId);
      if (!user) return res.json([]);
      
      const favoritesList = (user.favorites || []).map((favId: string) => {
         return db.users.find(u => u._id.toString() === favId.toString());
      }).filter(Boolean);
      
      return res.json(favoritesList);
    }

    const user = await User.findById(userId).populate('favorites', '-password');
    if (!user) return res.json([]);

    res.json(user.favorites || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
