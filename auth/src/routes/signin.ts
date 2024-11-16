import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/users';
import { validateRequest, BadRequestError } from '@weitickets/common';
import { HashPassword } from '../utils/hash-password';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookies';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch = await HashPassword.compare(
      existingUser.password,
      password
    );

    if (!passwordMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    // generateTokenAndSetCookie(existingUser.id, existingUser.email, res);

    const userJwt = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY!
    );

    // Store jwt object in the "server" session
    req.session = {
      jwt: userJwt
    }

    res.status(201).send(existingUser);
  }
);

export { router as signinRouter };
