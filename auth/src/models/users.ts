import mongoose from 'mongoose';
import { HashPassword } from '../utils/hash-password';

// 創建新使用者會需要的屬性
interface UserAttrs {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

// 去除掉 _id 和 __v 用的 interface
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createAt: Date;
}

// extend UserDoc 來創建 User model 需要的屬性
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    createAt: { type: Date, default: Date.now() },
  },
  {
    toJSON: {
      // 不要回傳一些沒用的資訊
      transform(doc, ret) {
        ret.id = ret._id; // 重新mapping防止跟其他資料庫衝突
        delete ret._id;
        delete ret.password;
        delete ret.phoneNumber;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await HashPassword.toHash(this.get('password'));
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
