import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { validationResult } from 'express-validator';

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, role, phone, country, nic_passport,
          bio, craftSpecialization, address, workshopName, workshopLocation } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already registered' });

    const userData = { name, email, password, role, phone };

    if (role === 'tourist') {
      userData.country = country;
      userData.nic_passport = nic_passport;
    } else if (role === 'artist') {
      userData.bio = bio;
      userData.craftSpecialization = craftSpecialization || [];
      userData.address = address;
      userData.workshopName = workshopName;
      userData.workshopLocation = workshopLocation || {};
    }

    const user = await User.create(userData);
    res.status(201).json({ message: 'Registered successfully. Please log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminRegister = async (req, res) => {
  const { name, email, password, adminSecret } = req.body;
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: 'Invalid admin secret' });
  }
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    await User.create({ name, email, password, role: 'admin' });
    res.status(201).json({ message: 'Admin registered. Please log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(user._id, user.role);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};
