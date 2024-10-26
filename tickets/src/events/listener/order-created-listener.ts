import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@weitickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queueGroupName';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // find the ticket that order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // not ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Mark the ticket as being reserved by setting its orderId
    ticket.set({ orderId: data.id });

    // Save the ticket
    await ticket.save();

    // 更新版本
    await new TicketUpdatedPublisher(this.stan).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: data.id,
    });

    // ack msg
    msg.ack();
  }
}
