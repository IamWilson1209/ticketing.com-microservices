import request from 'supertest';
import { app } from '../../app';
import { getCookiesForSignedInTest } from '../../test/getCookiesForSigninTest';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@weitickets/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payments';

jest.mock('../../stripe');

it('reutrns 404 when an order is not found', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', getCookiesForSignedInTest())
    .send({
      orderId: new mongoose.Types.ObjectId().toHexString(),
      token: 'test-token',
    })
    .expect(404);
});

it('reutrns 401 when an order is not authorized', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', getCookiesForSignedInTest())
    .send({
      orderId: order.id,
      token: 'test-token',
    })
    .expect(401);
});

it('reutrns 400 when an order is cancelled', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Cancelled,
    version: 0,
    userId,
    price: 20,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', getCookiesForSignedInTest(userId))
    .send({
      orderId: order.id,
      token: 'hgowhogow',
    })
    .expect(400);
});

// it('reutrns a 201 with valid input', async () => {
//   const userId = new mongoose.Types.ObjectId().toHexString();
//   const price = Math.floor(Math.random() * 100000);

//   const order = Order.build({
//     id: new mongoose.Types.ObjectId().toHexString(),
//     status: OrderStatus.Created,
//     version: 0,
//     userId,
//     price,
//   });
//   await order.save();

//   await request(app)
//     .post('/api/payments')
//     .set('Cookie', getCookiesForSignedInTest(userId))
//     .send({
//       orderId: order.id,
//       token: 'tok_visa',
//     })
//     .expect(201);

//   const stripeCharges = await stripe.charges.list({ limit: 50 });
//   const stripeCharge = stripeCharges.data.find((charge) => {
//     return charge.amount === price * 100;
//   });

//   expect(stripeCharge).toBeDefined();
//   expect(stripeCharge!.currency).toEqual('usd');

//   const payment = await Payment.findOne({ orderId: order.id, stripeId: stripeCharge!.id });
//   expect(payment).not.toBeNull();
// });
