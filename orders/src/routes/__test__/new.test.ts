import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { getCookiesForSignedInTest } from '../../test/getCookiesForSigninTest';
import { Order, OrderStatus } from '../../models/order';
import { Commodity } from '../../models/commodity';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if commodity is not exist', async () => {
  const commodityId = new mongoose.Types.ObjectId();
  await request(app)
    .post('/api/orders')
    .set('Cookie', getCookiesForSignedInTest())
    .send({ commodityId })
    .expect(404);
});

it('returns an error if commodity is already reserved', async () => {
  const commodity = Commodity.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test commodity',
    price: 10,
  });
  await commodity.save();
  const order = Order.build({
    userId: 'geiowghiohgeow',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: commodity,
  });
  await order.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', getCookiesForSignedInTest())
    .send({ ticketId: commodity.id })
    .expect(400);
});

it('reserve a commodity', async () => {
  const commodity = Commodity.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test ticket',
    price: 10,
  });
  await commodity.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', getCookiesForSignedInTest())
    .send({ ticketId: commodity.id })
    .expect(201);
});

it('emits an order created event', async () => {
  const commodity = Commodity.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test commodity',
    price: 10,
  });
  await commodity.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', getCookiesForSignedInTest())
    .send({ ticketId: commodity.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
