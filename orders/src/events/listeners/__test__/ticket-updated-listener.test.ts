import { TicketUpdatedListener } from "../ticket-updated-listener"
import { natsWrapper } from "../../../nats-wrapper";
import { Commodity } from "../../../models/commodity";
import mongoose from "mongoose";
import { TicketUpdatedEvent } from "@weitickets/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const commodity = Commodity.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test Ticket',
    price: 10,
  })
  await commodity.save();

  const data: TicketUpdatedEvent['data'] = {
    id: commodity.id,
    version: commodity.version + 1,
    title: 'Updated Test Commodity',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(), //
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, commodity, data, msg };
}


it('find, updates, and saves a commodity', async () => {
  const { listener, commodity, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const updatedCommodity = await Commodity.findById(commodity.id);
  expect(updatedCommodity!.title).toEqual(data.title);
  expect(updatedCommodity!.price).toEqual(data.price);
  expect(updatedCommodity!.version).toEqual(data.version);
})

it('acks a message when commodity is updated', async () => {
  const { listener, commodity, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
})


it('does not call acks if the event has a skipped version number', async () => {
  const { listener, commodity, data, msg } = await setup();
  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {

  }
  expect(msg.ack).not.toHaveBeenCalled();
})