import { ClassifiedDocument, ClassifiedModel } from './classified.model.js';

export interface CreateClassifiedPayload {
  title: string;
  description: string;
  price: number;
  category: string;
  seller: string;
  location?: string;
  media?: string[];
  contactNumber: string;
}

export const createClassified = (payload: CreateClassifiedPayload) =>
  ClassifiedModel.create({ ...payload, media: payload.media ?? [] });

export const listClassifieds = () => ClassifiedModel.find().sort({ createdAt: -1 }).lean();

export const getClassified = (id: string) => ClassifiedModel.findById(id).populate('seller');

export const deleteClassified = (id: string) => ClassifiedModel.findByIdAndDelete(id);
