import { Router } from 'express';

import { authenticate } from '../../middlewares/authMiddleware.js';
import { createAFA, listVendorAFA } from './afa.controller.js';

export const afaRouter = Router();

afaRouter.post('/', authenticate, createAFA);
afaRouter.get('/vendor/:vendorId', authenticate, listVendorAFA);
