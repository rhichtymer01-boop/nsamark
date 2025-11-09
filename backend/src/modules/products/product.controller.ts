import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { AuthenticatedRequest } from '../../middlewares/authMiddleware.js';
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from './product.service.js';

export const listAllProducts = async (req: Request, res: Response) => {
  const products = await listProducts(req.query);
  res.json({ success: true, data: products });
};

export const createVendorProduct = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
  }

  const product = await createProduct({ ...req.body, vendor: req.user._id });
  res.status(httpStatus.CREATED).json({ success: true, data: product });
};

export const getProduct = async (req: Request, res: Response) => {
  const product = await getProductById(req.params.id);
  if (!product) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Product not found' });
  }

  res.json({ success: true, data: product });
};

export const updateVendorProduct = async (req: Request, res: Response) => {
  const product = await updateProduct(req.params.id, req.body);
  if (!product) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Product not found' });
  }

  res.json({ success: true, data: product });
};

export const removeProduct = async (req: Request, res: Response) => {
  await deleteProduct(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
};
