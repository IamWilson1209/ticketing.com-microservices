import { z } from "zod";
import { User } from "../models/users";


const userSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please provide a valid email' }), // 驗證有效的電子郵件
  password: z
    .string()
    .trim() // 去除首尾空格
    .min(1, { message: 'You must supply a password' }) // 驗證非空密碼
});

export { userSchema };
