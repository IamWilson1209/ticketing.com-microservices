import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@weitickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queueGroupName';
import { Commodity } from '../../models/commodity';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // find the ticket that order is reserving
    const commodity = await Commodity.findById(data.ticket.id);

    // not ticket, throw error
    if (!commodity) {
      throw new Error('Ticket not found');
    }

    // Mark the ticket as being reserved by setting its orderId
    commodity.set({ orderId: data.id });

    // Save the ticket
    await commodity.save();

    // 更新版本
    await new TicketUpdatedPublisher(this.stan).publish({
      id: commodity.id,
      version: commodity.version,
      title: commodity.title,
      price: commodity.price,
      userId: commodity.userId,
      orderId: data.id,
    });

    // ack msg
    msg.ack();
  }
}
