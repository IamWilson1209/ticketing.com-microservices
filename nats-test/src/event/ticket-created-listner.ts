import { Listener } from "./base-listener";
import { Message } from "node-nats-streaming";
import { TicketCreateEvent } from "./ticket-created-event";
import { Subjects } from "./subject";


export class TicketCreatedListener extends Listener<TicketCreateEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payment-service';

  onMessage(data: TicketCreateEvent['data'], msg: Message) {
    console.log(`Ticket created: ${data.id} / ${data.title} / ${data.price} `);
    msg.ack(); // acknowledge the message
  }
}