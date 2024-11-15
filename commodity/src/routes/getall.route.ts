import express, { Request, Response } from 'express';
import { Commodity } from '../models/commodity';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const commodity = await Commodity.find({
    orderId: undefined,
  });
  res.send(commodity);
});

export { router as getAllCommodityRouter };