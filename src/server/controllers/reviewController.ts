import { Response } from 'express';
import mongoose from 'mongoose';
import { Review } from '../models/Review.js';
import { Booking } from '../models/Booking.js';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { db } from '../inMemoryDb.js';

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId, providerId, rating, comment } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (mongoose.connection.readyState !== 1) {
      const newReview = {
        _id: new mongoose.Types.ObjectId().toString(),
        booking: bookingId,
        customer: req.user.id,
        provider: providerId,
        rating,
        comment,
        createdAt: new Date()
      };
      db.reviews.push(newReview);
      
      const allReviews = db.reviews.filter(r => r.provider.toString() === providerId.toString() || r.provider?._id?.toString() === providerId.toString());
      const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRating / allReviews.length;
      
      const p = db.users.find(u => u._id.toString() === providerId.toString());
      if (p) {
        p.averageRating = averageRating;
        p.reviewCount = allReviews.length;
      }

      return res.status(201).json(newReview);
    }

    const review = await Review.create({
      booking: bookingId,
      customer: req.user.id,
      provider: providerId,
      rating,
      comment
    });

    // Update the provider's average rating
    const allReviews = await Review.find({ provider: providerId });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allReviews.length;

    await User.findByIdAndUpdate(providerId, { 
      averageRating: averageRating,
      reviewCount: allReviews.length 
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getProviderReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { providerId } = req.params;
    
    if (mongoose.connection.readyState !== 1) {
      const providerReviews = db.reviews.filter(r => r.provider.toString() === providerId.toString() || r.provider?._id?.toString() === providerId.toString());
      return res.json(providerReviews);
    }

    const reviews = await Review.find({ provider: providerId })
      .populate('customer', 'name profileImage')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
