import { Router } from 'express';

import { authorize, authenticate } from '../../middlewares/authMiddleware.js';
import { kycUpload } from '../../middlewares/upload.js';
import { UserRole } from '../users/user.model.js';
import {
  getKYCRequestById,
  getKYCRequests,
  getMyKYC,
  submitKYCRequest,
  updateKYCRequestStatus
} from './kyc.controller.js';

export const kycRouter = Router();

kycRouter.post('/', authenticate, kycUpload.array('documents', 5), submitKYCRequest);
kycRouter.get('/me', authenticate, getMyKYC);
kycRouter.get('/', authenticate, authorize([UserRole.ADMIN]), getKYCRequests);
kycRouter.get('/:kycId', authenticate, authorize([UserRole.ADMIN]), getKYCRequestById);
kycRouter.patch('/:kycId', authenticate, authorize([UserRole.ADMIN]), updateKYCRequestStatus);
