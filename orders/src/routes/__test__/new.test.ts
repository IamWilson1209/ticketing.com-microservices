import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { getCookiesForSignedInTest } from '../../test/getCookiesForSigninTest';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if tickets is not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post('/api/orders')
    .set('Cookie', getCookiesForSignedInTest())
    .send({ ticketId })
    .expect(404);
});

it('returns an error if tickets is already reserved', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test ticket',
    price: 10,
  });
  await ticket.save();
  const order = Order.build({
    userId: 'geiowghiohgeow',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', getCookiesForSignedInTest())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserve a ticket', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test ticket',
    price: 10,
  });
  await ticket.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', getCookiesForSignedInTest())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order created event', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test ticket',
    price: 10,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', getCookiesForSignedInTest())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
