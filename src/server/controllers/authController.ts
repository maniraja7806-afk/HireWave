import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { db } from '../inMemoryDb.js';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, role, city, area, pincode, address } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const userExists = db.users.find(u => u.email === email || (u.username && u.username === username));
      if (userExists) return res.status(400).json({ message: 'User already exists' });
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const newUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        name, username, email, password: hashedPassword, role: role || 'Customer',
        city, area, pincode, address,
        createdAt: new Date()
      };
      db.users.push(newUser);
      
      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        token: generateToken(newUser._id, newUser.role),
      });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user: any = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      role: role || 'Customer',
      city, area, pincode, address
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString(), user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check existing in-memory users (for Admin and seeded users)
    if (mongoose.connection.readyState !== 1) {
      const user = db.users.find(u => u.email === email || (u.username === email));
      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          token: generateToken(user._id, user.role),
        });
      }
    } else {
      // Check database
      const user = await User.findOne({ $or: [{ email: email }, { username: email }] });
      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          token: generateToken(user._id.toString(), user.role),
        });
      }
    }

    // Dynamic Login for any other credentials (No storage needed)
    const fakeId = new mongoose.Types.ObjectId().toString();
    const displayName = email.split('@')[0];
    
    return res.json({
      _id: fakeId,
      name: displayName,
      username: displayName,
      email: email.includes('@') ? email : `${email}@example.com`,
      role: 'Customer',
      token: generateToken(fakeId, 'Customer'),
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
