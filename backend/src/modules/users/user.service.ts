import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '../../config/env.js';
import { UserDocument, UserModel, UserRole } from './user.model.js';

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
  vendorType?: string;
}

export const createUser = async (payload: CreateUserPayload): Promise<UserDocument> => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await UserModel.create({
    ...payload,
    password: hashedPassword,
    role: payload.role ?? UserRole.CUSTOMER
  });

  return user;
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return null;
  }

  const token = jwt.sign({ userId: user._id }, env.jwtSecret, { expiresIn: '7d' });

  return { user, token };
};

export const listUsersByRole = async (role: UserRole) => {
  return UserModel.find({ role }).lean();
};
