import { SubscriptionDocument, SubscriptionModel } from './subscription.model.js';

export interface CreateSubscriptionPayload {
  name: string;
  planType: SubscriptionDocument['planType'];
  price: number;
  benefits?: string[];
}

export const createSubscription = (payload: CreateSubscriptionPayload) =>
  SubscriptionModel.create({ ...payload, benefits: payload.benefits ?? [] });

export const listSubscriptions = () => SubscriptionModel.find({ isActive: true }).lean();

export const updateSubscription = (id: string, updates: Partial<SubscriptionDocument>) =>
  SubscriptionModel.findByIdAndUpdate(id, updates, { new: true });
