import jwt from 'jsonwebtoken'
import { Response } from 'express'

export const generateTokenAndSetCookie = (userId: string, userEmail: string, res: Response) => {
  const token = jwt.sign({ id: userId, email: userEmail }, process.env.JWT_KEY!, {
    expiresIn: "1d",
  });
  res.cookie("jwt", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true, // 資安設定：防止 XSS attack
    sameSite: "strict", // 資安設定：防止 CSRF attack
    secure: process.env.NODE_ENV !== "development", // Only set cookie over HTTPS in production 
  })
}