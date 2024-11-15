import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@weitickets/common';
import { Commodity } from '../models/commodity';
import { Tag } from '../models/tags';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import { commoditySchema } from '../schema/commoditySchema';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const data = commoditySchema.parse(req.body);

    const { title, price, category, desc, tags } = data;

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
      // 創建每個 Tag 並儲存
      const tagPromises = tags.map((tag: string) => {
        // 創建 Tag 實例
        return Tag.build({ commodityId: commodity.id, name: tag }).save();
      });

      // 等待所有 tags 儲存完成
      const savedTags = await Promise.all(tagPromises);

      // 更新商品的 tags 欄位，將儲存的 tags 的 ObjectId 設置進 commodity 的 tags 陣列
      commodity.tags = savedTags.map(tag => tag.id);  // 記得使用 `.id` 屬性，這是 `Tag` 的 `_id`
      await commodity.save();  // 更新商品資料，儲存 tags 關聯
    }

    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: commodity.id,
      version: commodity.version,
      title: commodity.title,
      price: commodity.price,
      userId: commodity.userId,
    });

    // const commodityWithTags = await Commodity.findById(commodity.id).populate('tags');
    res.status(201).send(commodity);
  }
);

export { router as createCommodityRouter };
