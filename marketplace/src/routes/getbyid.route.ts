import express, { Request, Response } from 'express';
import { Commodity } from '../models/commodity';
import { NotFoundError } from '@weitickets/common';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const commodity = await Commodity.findById(req.params.id);
  if (!commodity) {
    throw new NotFoundError();
  }
  res.send(commodity);
});


export { router as getCommodityByIdRouter };