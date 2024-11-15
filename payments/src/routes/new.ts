import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizeError,
  OrderStatus,
} from '@weitickets/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payments';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';
const nodemailer = require('nodemailer');

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('orderId').notEmpty().withMessage('Order ID is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log('Processing payment...', req.body);

    const { token, orderId, email, password } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizeError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Order is cancelled');
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100, // cents
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    if (payment) {
      const mailTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      mailTransport.sendMail(
        {
          from: `"Ticketing.com": ${GMAIL_USER}`,
          to: email,
          subject: 'Payment Success!',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
              <h2 style="color: #333;">Thank you for your purchase!</h2>
              <p>Your order ID: <strong>${orderId}</strong></p>
              <p>Your payment ID: <strong>${payment.id}</strong></p>
              <p style="font-size: 16px;">Start purchasing other items now...</p>
              <a href="http://www.weishiuan-ticketing.pro" style="display: inline-block; padding: 10px 15px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Continue Shopping</a>
            </div>
          `,
        },
        function (err: Error | null) {
          if (err) {
            console.error('Unable to send confirmation: ' + err.stack);
          }
        }
      );
    }

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
