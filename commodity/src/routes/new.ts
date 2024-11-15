import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@weitickets/common';
import { body } from 'express-validator';
import { Commodity } from '../models/commodity';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a number'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const commodity = Commodity.build({ title, price, userId: req.currentUser!.id });

    await commodity.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: commodity.id,
      version: commodity.version,
      title: commodity.title,
      price: commodity.price,
      userId: commodity.userId,
    });
    res.status(201).send(commodity);
  }
);



export { router as createTicketRouter };
