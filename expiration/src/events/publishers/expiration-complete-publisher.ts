import { Subjects, Publisher, TicketCreateEvent, ExpirationCompleteEvent } from '@weitickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}