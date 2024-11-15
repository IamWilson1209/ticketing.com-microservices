import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@weitickets/common';
import { Commodity } from '../../models/commodity';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {

    const commodity = await Commodity.findByEvent(data)

    if (!commodity) {
      //
      throw new Error('Commodity not found');
    }

    const { title, price } = data;
    commodity.set({ title, price });
    await commodity.save();

    msg.ack();
  }
}
