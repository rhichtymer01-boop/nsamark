import { Request, Response } from 'express';

import { AuthenticatedRequest } from '../../middlewares/authMiddleware.js';
import { creditWallet, debitWallet, listWalletTransactions } from './wallet.service.js';

export const getWalletTransactions = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const transactions = await listWalletTransactions(req.user._id);
  res.json({ success: true, data: transactions });
};

export const topUpWallet = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const wallet = await creditWallet(req.user._id, req.body.amount, req.body.description ?? 'Wallet top-up');
  res.json({ success: true, data: wallet });
};

export const withdrawFromWallet = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const wallet = await debitWallet(req.user._id, req.body.amount, req.body.description ?? 'Wallet withdrawal');
  res.json({ success: true, data: wallet });
};
