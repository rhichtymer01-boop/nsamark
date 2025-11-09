import { Router } from 'express';

import { listTransporters } from './transporter.controller.js';

export const transporterRouter = Router();

transporterRouter.get('/', listTransporters);
