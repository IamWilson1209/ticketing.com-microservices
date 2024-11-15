import { ZodError, ZodIssue } from 'zod';
import { CustomError } from '@weitickets/common';

export class ZodRequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ZodIssue[]) {
    super('Invalid request payload.');
    Object.setPrototypeOf(this, ZodRequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      const field = err.path[0];

      return {
        message: err.message,
        field: field as string,
      };
    });
  }
}