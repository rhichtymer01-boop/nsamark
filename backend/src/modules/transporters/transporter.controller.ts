import { Request, Response } from 'express';

import { listVendors } from '../vendors/vendor.service.js';

export const listTransporters = async (req: Request, res: Response) => {
  const transporterType = req.query.type as string | undefined;
  const filter: Record<string, unknown> = { category: 'transporter' };
  if (transporterType) {
    filter.transporterType = transporterType;
  }

  const transporters = await listVendors(filter);
  res.json({ success: true, data: transporters });
};
