import mongoose from 'mongoose';
import { Password } from '../services/password';

// 創建新使用者會需要的屬性
interface UserAttrs {
  email: string;
  password: string;
}

// 去除掉_id 和 __v 用的 interface
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// extend UserDoc 來創建 User model 需要的屬性
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      // 不要回傳一些沒用的資訊
      transform(doc, ret) {
        ret.id = ret._id; // 重新mapping防止跟其他資料庫衝突
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// 接收 UserDoc, 回傳 UserModel
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
