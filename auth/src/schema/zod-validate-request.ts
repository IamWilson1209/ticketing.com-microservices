import { Request, Response, NextFunction } from 'express';
import { userSchema } from './userSchema';
import { ZodRequestValidationError } from './zod-request-validation-error';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const result = userSchema.safeParse(req.body);

  if (!result.success) {
    throw new ZodRequestValidationError(result.error.errors);
  }

  next();
};
