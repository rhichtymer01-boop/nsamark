import { Router } from 'express';

import { authenticate } from '../../middlewares/authMiddleware.js';
import { getWalletTransactions, topUpWallet, withdrawFromWallet } from './wallet.controller.js';

export const walletRouter = Router();

walletRouter.get('/', authenticate, getWalletTransactions);
walletRouter.post('/top-up', authenticate, topUpWallet);
walletRouter.post('/withdraw', authenticate, withdrawFromWallet);
