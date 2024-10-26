import { OrderCreatedEvent, OrderStatus } from "@weitickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Order } from "../../../models/order";

const setup = () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: 'hfiweig',
    ticket: {
      id: 'fiweig',
      price: 99,
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  return { listener, data, msg };
}

it('replicate order info', async () => {
  const { listener, data, msg } = setup();
  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);

})

it('ack the message', async () => {
  const { listener, data, msg } = setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
})