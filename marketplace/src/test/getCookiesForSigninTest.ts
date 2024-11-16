import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../app';
import mongoose from 'mongoose';

export const getCookiesForSignedInTest = () => {
  // Build JWT payload {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@example.com',
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object
  const session = { jwt: token };

  // Turn session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64Session = Buffer.from(sessionJSON).toString('base64');

  // Return the cookie
  return [`session=${base64Session}`];
};
