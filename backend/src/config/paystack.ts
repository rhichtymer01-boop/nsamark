import axios from 'axios';

import { env } from './env.js';

export const paystackClient = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${env.paystack.secretKey}`,
    'Content-Type': 'application/json'
  }
});
