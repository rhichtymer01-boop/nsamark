import { Router } from 'express';

import { authorize, authenticate } from '../../middlewares/authMiddleware.js';
import { UserRole } from '../users/user.model.js';
import { createPluginEntry, getPlugins, updatePluginEntry } from './plugin.controller.js';

export const pluginRouter = Router();

pluginRouter.get('/', authenticate, getPlugins);
pluginRouter.post('/', authenticate, authorize([UserRole.ADMIN]), createPluginEntry);
pluginRouter.put('/:id', authenticate, authorize([UserRole.ADMIN]), updatePluginEntry);
