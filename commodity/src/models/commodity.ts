import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export enum Category {
  Clothes = "Clothes",
  Shoes = "Shoes",
  Books = "Books",
  Electronics = "Electronics",
  Furniture = "Furniture",
  Other = "Other",
}

interface CommodityAttrs {
  title: string;
  price: number;
  userId: string;
  category: string;
  desc?: string;
  tags?: mongoose.Types.ObjectId[];
}

interface CommodityDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  category: string;
  desc?: string;
  tags: mongoose.Types.ObjectId[];
  orderId?: string;
  createdAt: Date;
  updateAt: Date;
  version: number;
}

interface CommodityModel extends mongoose.Model<CommodityDoc> {
  build(attrs: CommodityAttrs): CommodityDoc;
}

const commoditySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    userId: { type: String, required: true },
    category: { type: String, required: true },
    desc: { type: String },
    orderId: { type: String },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

commoditySchema.set('versionKey', 'version'); // 使用 version 欄位作為版本控制的欄位
commoditySchema.plugin(updateIfCurrentPlugin);

commoditySchema.statics.build = (attrs: CommodityAttrs) => {
  return new Commodity(attrs);
};

const Commodity = mongoose.model<CommodityDoc, CommodityModel>('Commodity', commoditySchema);

export { Commodity };
