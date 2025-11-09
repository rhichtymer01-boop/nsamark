import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { AuthenticatedRequest } from '../../middlewares/authMiddleware.js';
import { UserRole } from './user.model.js';
import { authenticateUser, createUser, listUsersByRole } from './user.service.js';

export const registerUser = async (req: Request, res: Response) => {
  const user = await createUser(req.body);
  res.status(httpStatus.CREATED).json({ success: true, data: user });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authenticateUser(email, password);

  if (!result) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Invalid credentials' });
  }

  res.json({ success: true, data: { user: result.user, token: result.token } });
};

export const me = (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: req.user });
};

export const listVendors = async (_req: Request, res: Response) => {
  const vendors = await listUsersByRole(UserRole.VENDOR);
  res.json({ success: true, data: vendors });
};
