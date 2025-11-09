import { FilterQuery } from 'mongoose';

import { ProductDocument, ProductModel } from './product.model.js';

export interface CreateProductPayload {
  vendor: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  media?: string[];
  tags?: string[];
  type?: ProductDocument['type'];
}

export const createProduct = async (payload: CreateProductPayload) => {
  return ProductModel.create({
    ...payload,
    media: payload.media ?? [],
    tags: payload.tags ?? []
  });
};

export const listProducts = async (filter: FilterQuery<ProductDocument> = {}) => ProductModel.find(filter).lean();

export const getProductById = async (id: string) => ProductModel.findById(id).populate('vendor');

export const updateProduct = async (id: string, updates: Partial<ProductDocument>) =>
  ProductModel.findByIdAndUpdate(id, updates, { new: true });

export const deleteProduct = async (id: string) => ProductModel.findByIdAndDelete(id);
