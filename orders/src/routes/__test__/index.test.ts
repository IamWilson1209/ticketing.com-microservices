import request from 'supertest';
import { app } from '../../app';
import { Commodity } from '../../models/commodity';
import { getCookiesForSignedInTest } from '../../test/getCookiesForSigninTest';
import mongoose from 'mongoose';

const buildCommodities = async () => {
  const commodity = Commodity.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: `Commodity`,
    price: 200,
  });
  await commodity.save();
  return commodity;
}

it('fetch orders for an particulate user', async () => {
  // Create tree tickets
  const commodityOne = await buildCommodities();
  const commodityTwo = await buildCommodities();
  const commodityThree = await buildCommodities();

  // Create User1 & 2
  const userOne = getCookiesForSignedInTest();
  const userTwo = getCookiesForSignedInTest();

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: commodityOne.id })
    .expect(201);

  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: commodityTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: commodityThree.id })
    .expect(201);

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id)
  expect(response.body[1].id).toEqual(orderTwo.id)
  expect(response.body[0].ticket.id).toEqual(commodityTwo.id)
  expect(response.body[1].ticket.id).toEqual(commodityThree.id)
})