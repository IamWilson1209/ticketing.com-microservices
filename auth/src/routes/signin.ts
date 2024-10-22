import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/users';
import { validateRequest, BadRequestError } from '@weitickets/common';
import { Password } from '../services/password';

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
    console.log('Logging in user:', existingUser);
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    console.log('Logging in user:', existingUser);

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );
    console.log("existingUser.password: ", existingUser.password, "password: ", password);
    console.log('Password match:', passwordMatch);
    if (!passwordMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    const userJwt = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt
    }

    res.status(201).send(existingUser);
  }
);

export { router as signinRouter };
