import { PluginDocument, PluginModel } from './plugin.model.js';

export interface CreatePluginPayload {
  name: string;
  description: string;
  type: PluginDocument['type'];
  price: number;
}

export const createPlugin = (payload: CreatePluginPayload) => PluginModel.create(payload);

export const listPlugins = () => PluginModel.find({ isActive: true }).lean();

export const updatePlugin = (id: string, updates: Partial<PluginDocument>) =>
  PluginModel.findByIdAndUpdate(id, updates, { new: true });
