import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import { createSession, setSessionCookies } from '../services/auth.js';
// import { Session } from '../models/session.js';

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
