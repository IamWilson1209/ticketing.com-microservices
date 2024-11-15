import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { getCookiesForSignedInTest } from '../../test/getCookiesForSigninTest';
import { natsWrapper } from '../../nats-wrapper';
import { Category, Commodity } from '../../models/commodity';

it('returns a 404 if provided id not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', getCookiesForSignedInTest())
    .send({
      title: 'Updated Test Commodity',
      price: 20,
      category: Category.Books,
    })
    .expect(404);
});

it('returns a 401 if user not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'Updated Test Commodity',
      price: 20,
      category: Category.Books,
    })
    .expect(401);
});

it('returns a 401 if user not own commodity', async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', getCookiesForSignedInTest())
    .send({
      title: 'Test Commodity',
      price: 20,
      category: Category.Books,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', getCookiesForSignedInTest()) // 隨機生成
    .send({
      title: 'Updated Test Commodity',
      price: 3000,
      category: Category.Books,
    })
    .expect(401);
});

it('returns a 400 if user provided invalid title or price', async () => {
  const cookie = getCookiesForSignedInTest();
  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({
      title: 'Test Commodity',
      price: 20,
      category: Category.Books,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
      category: Category.Books,
    });
  expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'xxxxxxx',
      price: -9999,
      category: Category.Books,
    });
  expect(400);
});

it('update Commoditise with valid input, returns a 200 on successful GET request', async () => {
  const cookie = getCookiesForSignedInTest();
  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({
      title: 'Test Commodity',
      price: 20,
      category: Category.Books,
    });
  expect(201);

  const commodityResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Updated Test Commodity',
      price: 30,
      category: Category.Books,
    });
  expect(200);

  expect(commodityResponse.body.title).toEqual('Updated Test Commodity');
  expect(commodityResponse.body.price).toEqual(30);
});

it('publishes an event', async () => {
  const cookie = getCookiesForSignedInTest();
  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({
      title: 'Test Commodity',
      price: 20,
      category: Category.Books,
    });
  expect(201);

  const commodityResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Updated Test Commodity',
      price: 30,
      category: Category.Books,
    });
  expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('reject updates if the commodity is reserved', async () => {
  const cookie = getCookiesForSignedInTest();

  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({
      title: 'Test Commodity',
      price: 20,
      category: Category.Books,
    });

  const commodity = await Commodity.findById(response.body.id);
  commodity!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await commodity!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Updated Test Commodity',
      price: 30,
      category: Category.Books,
    });
  expect(400);

});
