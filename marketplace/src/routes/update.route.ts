import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizeError,
  BadRequestError,
} from '@weitickets/common';
import { Commodity } from '../models/commodity';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a number'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const commodity = await Commodity.findById(req.params.id);

    if (!commodity) throw new NotFoundError();

    if (commodity.orderId) throw new BadRequestError('Cannot edit a reserved ticket');

    if (commodity.userId !== req.currentUser!.id) throw new NotAuthorizeError();

    commodity.set({ title: req.body.title, price: req.body.price });
    await commodity.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: commodity.id,
      version: commodity.version,
      title: commodity.title,
      price: commodity.price,
      userId: commodity.userId,
    })


    res.send(commodity);
  }
);

export { router as updateCommodityRouter };
