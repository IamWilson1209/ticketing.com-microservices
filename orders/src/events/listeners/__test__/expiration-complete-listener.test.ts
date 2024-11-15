import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";
import { Commodity } from "../../../models/commodity";
import mongoose from "mongoose";
import { ExpirationCompleteEvent, OrderStatus } from "@weitickets/common";
import { Message } from "node-nats-streaming";


const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const commodity = Commodity.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert commodity',
    price: 20,
  })
  await commodity.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'gjiogo',
    expiresAt: new Date(),
    ticket: commodity,
  })
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, commodity, order, data, msg };
}

it('update the order status cancelled', async () => {
  const { listener, commodity, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})

it('emit an order cancelled event', async () => {
  const { listener, commodity, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(eventData.id).toEqual(order.id);
})

it('ack the message', async () => {
  const { listener, commodity, order, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
})