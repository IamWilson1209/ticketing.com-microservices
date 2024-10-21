import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload; // New property for currentUser in Request interface
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.session?.jwt) {
    return next();
  }
  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
    req.currentUser = payload;
  } catch (error) {
    res.send({ currentUser: null });
  }
  next();
};
