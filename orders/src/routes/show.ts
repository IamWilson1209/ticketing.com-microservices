import express, { Request, Response } from 'express';
import {
  NotAuthorizeError,
  NotFoundError,
  requireAuth,
} from '@weitickets/common';
import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    console.log('---------------- show route: /api/orders/:orderId')

    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('ticket');

    console.log('show route order', order)
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizeError();
    }
    res.send(order);
  }
);

export { router as showOrdersRouter };