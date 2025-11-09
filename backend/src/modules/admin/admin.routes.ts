import { Router } from 'express';

import { authorize, authenticate } from '../../middlewares/authMiddleware.js';
import { UserRole } from '../users/user.model.js';
import { approveKYC, getAdminDashboard, rejectKYC } from './admin.controller.js';

export const adminRouter = Router();

adminRouter.use(authenticate, authorize([UserRole.ADMIN]));
adminRouter.get('/dashboard', getAdminDashboard);
adminRouter.post('/kyc/:kycId/approve', approveKYC);
adminRouter.post('/kyc/:kycId/reject', rejectKYC);
