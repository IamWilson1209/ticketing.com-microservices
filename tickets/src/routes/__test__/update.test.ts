import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { getCookiesForSignedInTest } from '../../test/getCookiesForSigninTest';

it('returns a 404 if provided id not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', getCookiesForSignedInTest())
    .send({
      title: 'Updated Test Ticket',
      price: 20,
    })
    .expect(404);
})

it('returns a 401 if user not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'Updated Test Ticket',
      price: 20,
    })
    .expect(401);
})

it('returns a 401 if user not own ticket', async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', getCookiesForSignedInTest())
    .send({
      title: 'Test Ticket',
      price: 20,
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', getCookiesForSignedInTest()) // 隨機生成
    .send({
      title: 'Updated Test Ticket',
      price: 3000,
    })
    .expect(401);
})

it('returns a 400 if user provided invalid title or price', async () => {
  const cookie = getCookiesForSignedInTest();
  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({
      title: 'Test Ticket',
      price: 20,
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
  expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'xxxxxxx',
      price: -9999,
    })
  expect(400);
})

it('update tickets with valid input, returns a 200 on successful GET request', async () => {
  const cookie = getCookiesForSignedInTest();
  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({
      title: 'Test Ticket',
      price: 20,
    })
  expect(201);

  const ticketResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Updated Test Ticket',
      price: 30,
    })
  expect(200);

  expect(ticketResponse.body.title).toEqual('Updated Test Ticket');
  expect(ticketResponse.body.price).toEqual(30);
});