import express, { Request, Response } from 'express';
import { requireAuth, zodValidateRequest, commoditySchema } from '@weitickets/common';
import { Commodity } from '../models/commodity';
import { Tag } from '../models/tags';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  zodValidateRequest(commoditySchema),
  async (req: Request, res: Response) => {

    const { title, price, category, desc, tags } = req.body;

    const commodity = Commodity.build({
      title,
      price,
      userId: req.currentUser!.id,
      category,
      desc,

    });
    await commodity.save();

    // 如果提供了 tags，處理 tags 的儲存和關聯
    if (tags && tags.length > 0) {
      const tagPromises = tags.map((tag: string) => {
        return Tag.build({ commodityId: commodity.id, name: tag }).save();
      });
      const savedTags = await Promise.all(tagPromises);
      commodity.tags = savedTags.map(tag => tag.id);
      await commodity.save();
    }

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

export { router as createCommodityRouter };
