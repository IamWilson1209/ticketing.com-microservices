import { Publisher } from "./base-publisher";
import { TicketCreateEvent } from "./ticket-created-event";
import { Subjects } from "./subject";

export class TicketCreatedPublisher extends Publisher<TicketCreateEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}