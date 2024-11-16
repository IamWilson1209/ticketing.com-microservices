import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class HashPassword {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex'); // 生成隨機 8 字節 salt

    // password: 用戶的原始密碼
    // salt: 一個隨機生成的字符串，增強密碼的安全性（e.g.："abc123def456"）
    // 64: 指定生成的哈希值的長度，以位元組計，這裡是 64 bytes
    // 1 bytes = 8 bit，e.g. 01100101
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }
  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}

/* 隨機生成一個 salt（例如：abc123def456789）
  使用密碼與 salt 經 scrypt 算法生成一個哈希值
  最終返回 "散列值.salt" 格式的結果

  散列值 (hashed password) + Salt
  例子："4a1dfe...d3a1d53.abc123def456789" */