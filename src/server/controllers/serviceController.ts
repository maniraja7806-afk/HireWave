import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Service } from '../models/Service.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { db } from '../inMemoryDb.js';

export const getServices = async (req: Request, res: Response) => {
  try {
    const { category, search, location } = req.query;

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

      return res.json(results);
    }

    let query: any = {};
    if (category) {
      query.category = category;
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const services = await Service.find(query).populate('provider', 'name email profileImage averageRating reviewCount experience serviceArea availability city');
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
