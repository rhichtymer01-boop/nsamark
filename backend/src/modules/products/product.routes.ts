import { Router } from 'express';

import { authenticate } from '../../middlewares/authMiddleware.js';
import {
  createVendorProduct,
  getProduct,
  listAllProducts,
  removeProduct,
  updateVendorProduct
} from './product.controller.js';

export const productRouter = Router();

productRouter.get('/', listAllProducts);
productRouter.get('/:id', getProduct);
productRouter.post('/', authenticate, createVendorProduct);
productRouter.put('/:id', authenticate, updateVendorProduct);
productRouter.delete('/:id', authenticate, removeProduct);
