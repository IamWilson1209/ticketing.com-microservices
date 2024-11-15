import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Commodity } from '../../../models/commodity';
import mongoose from 'mongoose';
import { OrderCreatedEvent } from '@weitickets/common';
import { OrderStatus } from '@weitickets/common';
import { Message } from 'node-nats-streaming';
import { Category } from '@weitickets/common';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const commodity = Commodity.build({
    title: 'concert ticket',
    price: 20,
    userId: 'gjiogo',
    category: Category.Books,
  });
  await commodity.save();

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'gjiogo',
    expiresAt: 'gjiogo',
    ticket: {
      id: commodity.id,
      price: commodity.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, commodity, data, msg };
};

it('set the user id of the commodity', async () => {
  const { listener, commodity, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedCommodity = await Commodity.findById(commodity.id);

  expect(updatedCommodity!.orderId).toEqual(data.id);
})

it('acks the message', async () => {
  const { listener, commodity, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
})

it('publish update event', async () => {
  const { listener, commodity, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  // @ts-ignore
  console.log(natsWrapper.client.publish.mock.calls[0][1]);
  const ticketUpdateDate = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

  expect(data.id).toEqual(ticketUpdateDate.orderId)
})