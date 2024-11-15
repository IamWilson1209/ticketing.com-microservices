import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Commodity } from '../../../models/commodity';
import mongoose from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from '@weitickets/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const commodity = Commodity.build({
    title: 'concert ticket',
    price: 20,
    userId: 'gjiogo',
  })
  commodity.set({ orderId });
  await commodity.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: commodity.id,
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, commodity, orderId, data, msg };
}

it('updates the commodity, publishes an event, and acks the message', async () => {
  const { listener, commodity, orderId, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedCommodity = await Commodity.findById(commodity.id);
  expect(updatedCommodity!.orderId).toBeUndefined();

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  expect(msg.ack).toHaveBeenCalled();
})