import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';

export const registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(400, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    phone: phone || null,
    password: hashedPassword,
  });
  const newSession = await createSession(newUser._id);
  setSessionCookies(res, newSession);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered user!',
    data: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
    },
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isValisPassword = await bcrypt.compare(password, user.password);
  if (!isValisPassword) {
    throw createHttpError(401, 'Invalid credentials');
  }
  await Session.deleteOne({ userID: user._id });
  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);
  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};
