import { Listener, OrderCancelledEvent, Subjects } from '@weitickets/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Commodity } from '../../models/commodity';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // find the ticket that order is reserving
    const commodity = await Commodity.findById(data.ticket.id);

    // not ticket, throw error
    if (!commodity) {
      throw new Error('Commodity not found');
    }

    // Mark the commodity as being reserved by setting undefined
    commodity.set({ orderId: undefined });

    // Save the ticket
    await commodity.save();

    // 更新版本
    await new TicketUpdatedPublisher(this.stan).publish({
      id: commodity.id,
      version: commodity.version,
      title: commodity.title,
      price: commodity.price,
      userId: commodity.userId,
      orderId: commodity.orderId,
    });

    // ack msg
    msg.ack();
  }
}