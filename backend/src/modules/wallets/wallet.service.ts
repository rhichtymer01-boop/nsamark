import { randomUUID } from 'node:crypto';

import { WalletDocument, WalletModel } from './wallet.model.js';

export const getOrCreateWallet = async (ownerId: string) => {
  let wallet = await WalletModel.findOne({ owner: ownerId });
  if (!wallet) {
    wallet = await WalletModel.create({ owner: ownerId });
  }
  return wallet;
};

export const creditWallet = async (ownerId: string, amount: number, description: string) => {
  const wallet = await getOrCreateWallet(ownerId);
  wallet.balance += amount;
  wallet.transactions.push({
    amount,
    type: 'credit',
    reference: randomUUID(),
    description,
    createdAt: new Date()
  });
  await wallet.save();
  return wallet;
};

export const debitWallet = async (ownerId: string, amount: number, description: string) => {
  const wallet = await getOrCreateWallet(ownerId);
  wallet.balance -= amount;
  wallet.transactions.push({
    amount,
    type: 'debit',
    reference: randomUUID(),
    description,
    createdAt: new Date()
  });
  await wallet.save();
  return wallet;
};

export const listWalletTransactions = async (ownerId: string) => {
  const wallet = await getOrCreateWallet(ownerId);
  return wallet.transactions;
};
