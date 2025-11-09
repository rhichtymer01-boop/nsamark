import { Router } from 'express';

import { authenticate } from '../../middlewares/authMiddleware.js';
import {
  createClassifiedListing,
  getClassifiedListing,
  listAllClassifieds,
  removeClassifiedListing
} from './classified.controller.js';

export const classifiedRouter = Router();

classifiedRouter.get('/', listAllClassifieds);
classifiedRouter.get('/:id', getClassifiedListing);
classifiedRouter.post('/', authenticate, createClassifiedListing);
classifiedRouter.delete('/:id', authenticate, removeClassifiedListing);
