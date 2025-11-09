import { OrderDocument, OrderModel, OrderStatus } from './order.model.js';

export interface CreateOrderPayload {
  customer: string;
  vendor: string;
  transporter?: string;
  items: Array<{ product: string; quantity: number; price: number }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  deliveryLocation?: { coordinates: [number, number] };
  metadata?: Record<string, unknown>;
}

export const createOrder = async (payload: CreateOrderPayload) => {
  return OrderModel.create({
    ...payload,
    deliveryLocation: {
      type: 'Point',
      coordinates: payload.deliveryLocation?.coordinates ?? [0, 0]
    }
  });
};

export const listOrdersForVendor = async (vendorId: string) => OrderModel.find({ vendor: vendorId }).lean();

export const listOrdersForTransporter = async (transporterId: string) =>
  OrderModel.find({ transporter: transporterId }).lean();

export const updateOrderStatus = async (orderId: string, status: OrderStatus) =>
  OrderModel.findByIdAndUpdate(orderId, { status }, { new: true });

export const assignTransporter = async (orderId: string, transporterId: string) =>
  OrderModel.findByIdAndUpdate(orderId, { transporter: transporterId, status: OrderStatus.CONFIRMED }, { new: true });
