import request from "supertest";
import { app } from "../app";

export const getCookiesForSignedInTest = async () => {
  const email = 'test@test.com';
  const password = 'password';
  const phoneNumber = '123456789';
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password, firstName: 'firstName', lastName: 'lastName', phoneNumber })
    .expect(201);
  const cookie = response.get("Set-Cookie");
  if (!cookie) {
    throw new Error("Failed to get cookie from response");
  }
  return cookie;
}