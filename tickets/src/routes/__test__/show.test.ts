import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { getCookiesForSignedInTest } from '../../test/getCookiesForSigninTest';

it('return a 404 status if ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/tickets/${id}`)
    .send({})
    .expect(404);
});

it('return the ticket if ticket is found', async () => {
  const cookie = getCookiesForSignedInTest();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test Ticket',
      price: 10,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send({})
    .expect(200);

  expect(ticketResponse.body.title).toEqual('Test Ticket');
  expect(ticketResponse.body.price).toEqual(10);
});
