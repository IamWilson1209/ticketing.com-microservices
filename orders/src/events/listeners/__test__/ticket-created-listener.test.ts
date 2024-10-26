import { TicketCreatedListener } from "../ticket-created-listener"
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreateEvent } from "@weitickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

it('returns an error if the ticket is not found', async () => {

})

const setup = async () => {
  // create an instance of listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // create a fake data event
  const data: TicketCreateEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'Test Ticket',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg };
}


// it('create and saves a ticket', async () => {
//   const { listener, data, msg } = await setup();

//   await listener.onMessage(data, msg);

//   // write assertions to verify the ticket was saved correctly
//   const ticket = await Ticket.findById(data.id);
//   expect(ticket).toBeDefined();
//   expect(ticket!.title).toEqual(data.title);
//   expect(ticket!.price).toEqual(data.price);
// })

// it('acks a message', async () => {
//   const { listener, data, msg } = await setup();
//   // call the onMessage method with the fake data and message
//   await listener.onMessage(data, msg);

//   expect(msg.ack).not.toHaveBeenCalled();
//   // write assertions to verify the ticket was saved correctly
// })
