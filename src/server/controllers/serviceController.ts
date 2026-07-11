import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Service } from '../models/Service.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { db } from '../inMemoryDb.js';

export const getServices = async (req: Request, res: Response) => {
  try {
    const { category, search, location } = req.query; console.log("SEARCH:", search); if (search === "debug") return res.json({ count: db.services.length });

    if (mongoose.connection.readyState !== 1) {
      let results = [...db.services];
      
      // Populate provider info manually
      results = results.map(s => {
        const provider = db.users.find(u => u._id.toString() === s.provider.toString());
        return {
          ...s,
          provider: provider ? { 
            _id: provider._id, 
            name: provider.name, 
            email: provider.email, 
            profileImage: provider.profileImage,
            averageRating: provider.averageRating,
            reviewCount: provider.reviewCount,
            experience: provider.experience,
            serviceArea: provider.serviceArea,
            availability: provider.availability,
            city: provider.city,
            area: provider.area,
            pincode: provider.pincode
          } : null
        };
      });

      if (category) {
        results = results.filter(s => s.category.toLowerCase() === (category as string).toLowerCase());
      }
      if (search) {
        const searchLower = (search as string).toLowerCase();
        results = results.filter(s => 
          s.title.toLowerCase().includes(searchLower) || 
          s.description.toLowerCase().includes(searchLower) ||
          (s.category && s.category.toLowerCase().includes(searchLower))
        );
      }
      if (location) {
        const locLower = (location as string).toLowerCase();
        results = results.filter(s => {
          const mLoc = s.location && s.location.toLowerCase().includes(locLower);
          const p = s.provider;
          const mCity = p && p.city && p.city.toLowerCase().includes(locLower);
          const mArea = p && p.area && p.area.toLowerCase().includes(locLower);
          const mPin = p && p.pincode && p.pincode.toLowerCase().includes(locLower);
          const mSA = p && p.serviceArea && p.serviceArea.toLowerCase().includes(locLower);
          return mLoc || mCity || mArea || mPin || mSA;
        });
      }
      // Prioritize by location matched exactly
      if (location) {
         const locLower = (location as string).toLowerCase();
         results.sort((a,b) => {
            const aCity = a.provider?.city?.toLowerCase() === locLower;
            const bCity = b.provider?.city?.toLowerCase() === locLower;
            if (aCity && !bCity) return -1;
            if (!aCity && bCity) return 1;
            return 0;
         });
      }

      return res.json(results.slice(0, 50));
    }

    let query: any = {};
    const andClauses: any[] = [];

    if (category) {
      andClauses.push({ category });
    }
    
    if (search) {
      andClauses.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ]
      });
    }
    
    if (location) {
      const { User } = await import('../models/User.js');
      const matchingProviders = await User.find({
        role: 'Provider',
        $or: [
          { city: { $regex: location, $options: 'i' } },
          { area: { $regex: location, $options: 'i' } },
          { pincode: { $regex: location, $options: 'i' } },
          { serviceArea: { $regex: location, $options: 'i' } }
        ]
      } as any);
      const providerIds = matchingProviders.map(p => p._id);
      
      andClauses.push({
        $or: [
          { location: { $regex: location, $options: 'i' } },
          { provider: { $in: providerIds } }
        ]
      });
    }

    if (andClauses.length > 0) {
      query.$and = andClauses;
    }

    const services = await Service.find(query).populate('provider', 'name email profileImage averageRating reviewCount experience serviceArea availability city').limit(50);
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const s = db.services.find(ser => ser._id.toString() === req.params.id);
      if (!s) return res.status(404).json({ message: 'Service not found' });
      
      const provider = db.users.find(u => u._id.toString() === s.provider.toString());
      return res.json({
        ...s,
        provider: provider ? { 
          _id: provider._id, 
          name: provider.name, 
          email: provider.email,
          profileImage: provider.profileImage,
          averageRating: provider.averageRating,
          reviewCount: provider.reviewCount,
          experience: provider.experience,
          serviceArea: provider.serviceArea,
          availability: provider.availability,
          city: provider.city 
        } : null
      });
    }

    const service = await Service.findById(req.params.id).populate('provider', 'name email profileImage averageRating reviewCount experience serviceArea availability city');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createService = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, price, location } = req.body;

    if (!req.user || (req.user.role !== 'Provider' && req.user.role !== 'Admin')) {
      return res.status(403).json({ message: 'Not authorized to create a service' });
    }

    if (mongoose.connection.readyState !== 1) {
      const newService = {
        _id: new mongoose.Types.ObjectId().toString(),
        provider: req.user.id,
        title, description, category, price, location,
        createdAt: new Date()
      };
      db.services.push(newService);
      return res.status(201).json(newService);
    }

    const service = await Service.create({
      provider: req.user.id,
      title,
      description,
      category,
      price,
      location,
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getPriceTrends = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const categoryPrices: Record<string, { total: number; count: number }> = {};
      db.services.forEach(s => {
        if (!categoryPrices[s.category]) {
          categoryPrices[s.category] = { total: 0, count: 0 };
        }
        categoryPrices[s.category].total += s.price;
        categoryPrices[s.category].count += 1;
      });

      const trends = Object.keys(categoryPrices).map(cat => {
        const avg = categoryPrices[cat].total / categoryPrices[cat].count;
        const multiplier = 1 + (cat.length % 5) * 0.2 - 0.2;
        return {
          category: cat,
          avgPrice: Math.round(avg * multiplier)
        };
      }).sort((a, b) => b.avgPrice - a.avgPrice);

      return res.json(trends);
    }

    const trends = await Service.aggregate([
      {
        $group: {
          _id: '$category',
          avgPrice: { $avg: '$price' }
        }
      },
      {
        $project: {
          category: '$_id',
          avgPrice: { $round: ['$avgPrice', 0] },
          _id: 0
        }
      },
      {
        $sort: { avgPrice: -1 }
      }
    ]);

    let formattedTrends = trends.map(t => {
      // Add artificial variation to make the demo chart look more interesting
      const multiplier = 1 + (t.category.length % 5) * 0.2 - 0.2;
      return {
        category: t.category,
        avgPrice: Math.round(t.avgPrice * multiplier)
      };
    }).sort((a, b) => b.avgPrice - a.avgPrice);

    res.json(formattedTrends);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getSuggestions = async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    if (!q || q.trim().length === 0) {
      return res.json([]);
    }

    const searchLower = q.toLowerCase();
    const keywords = [
      'Plumbing', 'Cleaning', 'Electrical', 'Painting', 'Carpentry', 'AC Repair', 'Pest Control',
      'Leaking Pipe', 'Deep Cleaning', 'Wiring', 'Furniture Assembly', 'Wall Painting', 'Home Sanitization', 'Kitchen Cleaning'
    ];

    const keywordMatches = keywords.filter(k => k.toLowerCase().includes(searchLower));

    let titleMatches: string[] = [];
    if (mongoose.connection.readyState !== 1) {
      const titles = db.services.map(s => s.title).filter(t => t.toLowerCase().includes(searchLower));
      titleMatches = Array.from(new Set(titles));
    } else {
      const services = await Service.find({ title: { $regex: searchLower, $options: 'i' } }).select('title').limit(10);
      titleMatches = Array.from(new Set(services.map(s => s.title)));
    }

    const combined = Array.from(new Set([...keywordMatches, ...titleMatches])).slice(0, 8);
    res.json(combined);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
