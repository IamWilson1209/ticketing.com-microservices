import { Request, Response, NextFunction } from 'express';
import { NotAuthorizeError } from '../errors/not-authorized-error';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.currentUser) {
    throw new NotAuthorizeError();
  }
};
