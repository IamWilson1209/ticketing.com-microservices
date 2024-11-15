import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { getCookiesForSignedInTest } from '../../test/getCookiesForSigninTest';
import { Category } from '@weitickets/common';


it('return a 404 status if commodity is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/tickets/${id}`)
    .send({})
    .expect(404);
});

it('return the commodity if commodity is found', async () => {
  const cookie = getCookiesForSignedInTest();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test commodity',
      price: 10,
      category: Category.Books,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send({})
    .expect(200);

  expect(ticketResponse.body.title).toEqual('Test commodity');
  expect(ticketResponse.body.price).toEqual(10);
});
