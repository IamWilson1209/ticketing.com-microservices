import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreateEvent } from '@weitickets/common';
import { Commodity } from '../../models/commodity';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreateEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreateEvent['data'], msg: Message) {
    const { id, title, price } = data;

    const ticket = Commodity.build({ id, title, price });
    await ticket.save();

    msg.ack();
  }
}


