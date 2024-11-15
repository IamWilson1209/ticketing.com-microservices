import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface CommodityAttrs {
  title: string;
  price: number;
  userId: string;
}

interface CommodityDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

interface CommodityModel extends mongoose.Model<CommodityDoc> {
  build(attrs: CommodityAttrs): CommodityDoc;
}

const commoditySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    userId: { type: String, required: true },
    orderId: { type: String },
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

commoditySchema.set('versionKey', 'version');
commoditySchema.plugin(updateIfCurrentPlugin);

commoditySchema.statics.build = (attrs: CommodityAttrs) => {
  return new Commodity(attrs);
};

const Commodity = mongoose.model<CommodityDoc, CommodityModel>('Commodity', commoditySchema);

export { Commodity };
