import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // // 可選的配置
  // callbacks: {
  //   async jwt({ token, account }) {
  //     // 在這裡可以將用戶資訊添加到 token 中
  //     if (account) {
  //       token.accessToken = account.access_token;
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     // 將 token 中的資訊添加到 session 中
  //     session.accessToken = token.accessToken;
  //     return session;
  //   },
  // },
});
