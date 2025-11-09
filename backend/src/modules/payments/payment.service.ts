import axios from 'axios';
import httpStatus from 'http-status';

import { env } from '../../config/env.js';

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export const initializePaystackTransaction = async (payload: { email: string; amount: number; reference: string }) => {
  const response = await axios.post<PaystackInitializeResponse>(
    'https://api.paystack.co/transaction/initialize',
    {
      email: payload.email,
      amount: payload.amount * 100,
      reference: payload.reference,
      callback_url: env.paystack.callbackUrl
    },
    {
      headers: {
        Authorization: `Bearer ${env.paystack.secretKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.data.status || !response.data.data) {
    const error = new Error(response.data.message || 'Failed to initialize Paystack transaction');
    (error as Error & { statusCode: number }).statusCode = httpStatus.BAD_GATEWAY;
    throw error;
  }

  return response.data.data;
};
