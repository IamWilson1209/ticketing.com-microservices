import request from "supertest";
import { app } from "../../app";
import { Commodity } from "../../models/commodity";
import { getCookiesForSignedInTest } from "../../test/getCookiesForSigninTest";
import mongoose from "mongoose";

it('fetches the order', async () => {
  // Create a ticket
  const commodity = Commodity.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await commodity.save();

  const user = getCookiesForSignedInTest();
  // make a request to build an order with this commodity
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: commodity.id })
    .expect(201);

  // make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
  // Create a commodity
  const commodity = Commodity.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await commodity.save();

  const user = getCookiesForSignedInTest();
  // make a request to build an order with this commodity
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: commodity.id })
    .expect(201);

  // make request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', getCookiesForSignedInTest())
    .send()
    .expect(401);
});