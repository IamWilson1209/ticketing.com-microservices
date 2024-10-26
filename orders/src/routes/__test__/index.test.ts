import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { getCookiesForSignedInTest } from '../../test/getCookiesForSigninTest';
import mongoose from 'mongoose';

const buildTickets = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: `Ticket`,
    price: 200,
  });
  await ticket.save();
  return ticket;
}

it('fetch orders for an particulate user', async () => {
  // Create tree tickets
  const ticketOne = await buildTickets();
  const ticketTwo = await buildTickets();
  const ticketThree = await buildTickets();

  // Create User1 & 2
  const userOne = getCookiesForSignedInTest();
  const userTwo = getCookiesForSignedInTest();

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id)
  expect(response.body[1].id).toEqual(orderTwo.id)
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id)
  expect(response.body[1].ticket.id).toEqual(ticketThree.id)
})