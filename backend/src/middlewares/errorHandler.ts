import type { Request, Response, NextFunction } from 'express';
import { isHttpError } from 'http-errors';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {

  if (isHttpError(err)) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
    return;
  }


  console.error(err);
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
  });
};
