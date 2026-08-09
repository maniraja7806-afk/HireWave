import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { db } from '../inMemoryDb.js';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, role, city, area, pincode, address, category, phoneNumber, experience, hourlyCharge } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const userExists = db.users.find(u => u.email === email || (u.username && u.username === username));
      if (userExists) return res.status(400).json({ message: 'User already exists' });
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const newUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        name, username, email, password: hashedPassword, role: role || 'Customer',
        city, area, pincode, address, category, phoneNumber, experience, hourlyCharge,
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
      city, area, pincode, address, category, phoneNumber, experience, hourlyCharge
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
    
    if (!email && !password) {
      return res.status(400).json({ message: 'Invalid username/email or password.' });
    }
    if (!email) {
      return res.status(400).json({ message: 'Please enter your username or email.' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Please enter your password.' });
    }

    let user;
    if (mongoose.connection.readyState !== 1) {
      user = db.users.find(u => u.email === email || (u.username === email));
    } else {
      user = await User.findOne({ $or: [{ email: email }, { username: email }] });
    }

    if (!user) {
      return res.status(404).json({ message: 'Account not found. Please create an account before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString(), user.role),
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
