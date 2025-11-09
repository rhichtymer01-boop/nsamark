import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { UserDocument, UserModel } from '../modules/users/user.model.js';

export interface AuthenticatedRequest extends Request {
  user?: UserDocument;
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Missing authorization token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.jwtSecret) as { userId: string };
    const user = await UserModel.findById(payload.userId);
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Invalid token' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(httpStatus.FORBIDDEN).json({ success: false, message: 'Forbidden' });
    }

    next();
  };
};
