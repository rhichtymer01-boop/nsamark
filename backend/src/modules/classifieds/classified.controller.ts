import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { AuthenticatedRequest } from '../../middlewares/authMiddleware.js';
import { createClassified, deleteClassified, getClassified, listClassifieds } from './classified.service.js';

export const listAllClassifieds = async (_req: Request, res: Response) => {
  const classifieds = await listClassifieds();
  res.json({ success: true, data: classifieds });
};

export const createClassifiedListing = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
  }

  const classified = await createClassified({ ...req.body, seller: req.user._id });
  res.status(httpStatus.CREATED).json({ success: true, data: classified });
};

export const getClassifiedListing = async (req: Request, res: Response) => {
  const classified = await getClassified(req.params.id);
  if (!classified) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Listing not found' });
  }

  res.json({ success: true, data: classified });
};

export const removeClassifiedListing = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
  }

  await deleteClassified(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
};
