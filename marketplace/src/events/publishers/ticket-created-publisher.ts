import { Publisher, Subjects, TicketCreateEvent } from "@weitickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreateEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}