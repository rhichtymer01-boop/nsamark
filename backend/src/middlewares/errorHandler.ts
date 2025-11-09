import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import { logger } from '../config/logger.js';

interface ApiError extends Error {
  statusCode?: number;
  details?: unknown;
}

export const errorHandler = (error: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = error.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR;
  const response = {
    success: false,
    message: error.message || 'Internal Server Error',
    details: error.details
  };

  if (statusCode >= 500) {
    logger.error(error.message, { stack: error.stack });
  }

  res.status(statusCode).json(response);
};
