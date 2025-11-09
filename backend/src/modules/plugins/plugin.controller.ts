import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { createPlugin, listPlugins, updatePlugin } from './plugin.service.js';

export const getPlugins = async (_req: Request, res: Response) => {
  const plugins = await listPlugins();
  res.json({ success: true, data: plugins });
};

export const createPluginEntry = async (req: Request, res: Response) => {
  const plugin = await createPlugin(req.body);
  res.status(httpStatus.CREATED).json({ success: true, data: plugin });
};

export const updatePluginEntry = async (req: Request, res: Response) => {
  const plugin = await updatePlugin(req.params.id, req.body);
  if (!plugin) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Plugin not found' });
  }

  res.json({ success: true, data: plugin });
};
