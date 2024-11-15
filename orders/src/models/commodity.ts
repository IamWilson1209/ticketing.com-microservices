import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './order';

interface CommodityAttrs {
  id: string;
  title: string;
  price: number;
}

export interface CommodityDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface CommodityModel extends mongoose.Model<CommodityDoc> {
  build(attrs: CommodityAttrs): CommodityDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<CommodityDoc | null>;
}

const commoditySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
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

// ticketSchema.pre('save', async function (done) {
//   // @ts-ignore
//   this.$where = {
//     version: this.get('version') - 1,
//   }
//   done();
// })

commoditySchema.statics.findByEvent = async (event: {
  id: string;
  version: number;
}) => {
  return Commodity.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

commoditySchema.statics.build = (attrs: CommodityAttrs) => {
  return new Commodity({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};
commoditySchema.methods.isReserved = async function () {
  //this === the ticket doc we just called 'isReserced' on
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  return !!existingOrder; // null === false, else true
};

const Commodity = mongoose.model<CommodityDoc, CommodityModel>('Commodity', commoditySchema);

export { Commodity };
