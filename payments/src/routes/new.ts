import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizeError, OrderStatus } from '@weitickets/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payments';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/payments', requireAuth, [
  body('token').notEmpty().withMessage('Token is required'),
  body('orderId').notEmpty().withMessage('Order ID is required'),
], validateRequest, async (req: Request, res: Response) => {

  const { token, orderId } = req.body;
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
  })

  const payment = Payment.build({
    orderId,
    stripeId: charge.id,
  })
  await payment.save();

  await new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    orderId: payment.orderId,
    stripeId: payment.stripeId,
  })

  res.status(201).send({ id: payment.id })

})

export { router as createChargeRouter }