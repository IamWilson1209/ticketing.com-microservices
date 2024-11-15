import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export enum TagCategory {
  Man = "Man",
  Woman = "Woman",
  Child = "Child",
  Home = "Home",
  Business = "Business",
  Leisure = "Leisure",
  Fashion = "Fashion",
  Summer = "Summer",
  Sports = "Sports",
  Outdoor = "Outdoor",
  Garden = "Garden",
  Health = "Health",
  Travel = "Travel",
}

interface TagAttrs {
  name: string;
  commodityId: mongoose.Types.ObjectId;
}

interface TagDoc extends mongoose.Document {
  name: string;
  commodityId: mongoose.Types.ObjectId;
  createdAt: Date;
  updateAt: Date;
  version: number;
}

interface TagModel extends mongoose.Model<TagDoc> {
  build(attrs: TagAttrs): TagDoc;
}

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    commodityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Commodity', required: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
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

tagSchema.set('versionKey', 'version'); // 使用 version 欄位作為版本控制的欄位
tagSchema.plugin(updateIfCurrentPlugin);

tagSchema.statics.build = (attrs: TagAttrs) => {
  return new Tag(attrs);
};

const Tag = mongoose.model<TagDoc, TagModel>('Tag', tagSchema);

export { Tag };
