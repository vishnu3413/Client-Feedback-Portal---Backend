import jwt from 'jsonwebtoken';
import { config } from '../config/dotenv.js';
import { PrismaClient } from '@prisma/client';

const { JWT_SECRET } = config;
const prisma = new PrismaClient();

// Middleware to verify JWT token and attach user info to the request object.
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token: user not found.' });
    }

    req.user = {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.', error: err.message });
  }
};

// Middleware to check if user has admin privileges.
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};
