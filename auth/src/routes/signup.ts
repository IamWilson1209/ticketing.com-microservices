import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@weitickets/common';
import { User } from '../models/users';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookies';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters long'),
  ],
  validateRequest,
  async (req: Request, res: Response): Promise<void> => {

    const { email, password, firstName, lastName, phoneNumber } = req.body;

    const existingUser = await User.findOne({
      $or: [
        { email }, { phoneNumber }
      ]
    });
    if (existingUser) {
      throw new BadRequestError('Email already in use');
    }

    const user = User.build({ email, password, firstName, lastName, phoneNumber });
    await user.save();

    // generateTokenAndSetCookie(user.id, user.email, res);

    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY! // 已經檢查過了
    );

    // Store jwt object in the session
    req.session = {
      jwt: userJwt
    }

    res.status(201).send(user);
  }
);

export { router as signupRouter };
