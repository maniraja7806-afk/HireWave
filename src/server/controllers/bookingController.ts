import { Response } from 'express';
import mongoose from 'mongoose';
import { Booking } from '../models/Booking.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { db } from '../inMemoryDb.js';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { provider, service, date } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (mongoose.connection.readyState !== 1) {
      const p = db.users.find(u => u._id.toString() === provider.toString());
      const c = db.users.find(u => u._id.toString() === req.user!.id);
      const s = db.services.find(serv => serv._id.toString() === service.toString());
      
      const newBooking = {
        _id: new mongoose.Types.ObjectId().toString(),
        customer: c ? { _id: c._id, name: c.name, email: c.email } : req.user.id,
        provider: p ? { _id: p._id, name: p.name, email: p.email } : provider,
        service: s ? { _id: s._id, title: s.title, category: s.category } : service,
        date,
        status: 'Pending',
        createdAt: new Date()
      };
      db.bookings.push(newBooking);
      return res.status(201).json(newBooking);
    }

    const booking = await Booking.create({
      customer: req.user.id,
      provider,
      service,
      date,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (mongoose.connection.readyState !== 1) {
      const myBookings = db.bookings.filter(b => {
        if (req.user!.role === 'Provider') {
          return b.provider._id ? b.provider._id.toString() === req.user!.id : b.provider.toString() === req.user!.id;
        } else {
          return b.customer._id ? b.customer._id.toString() === req.user!.id : b.customer.toString() === req.user!.id;
        }
      });
      return res.json(myBookings);
    }

    let bookings;
    if (req.user.role === 'Provider') {
      bookings = await Booking.find({ provider: req.user.id }).populate('service').populate('customer', 'name email');
    } else {
      bookings = await Booking.find({ customer: req.user.id }).populate('service').populate('provider', 'name email');
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'Provider') {
      return res.status(403).json({ message: 'Not authorized to update status' });
    }

    const { status } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const booking = db.bookings.find(b => b._id.toString() === req.params.id);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      booking.status = status;
      return res.json(booking);
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.provider.toString() !== req.user.id) {
       return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    const updatedBooking = await booking.save();
    
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
