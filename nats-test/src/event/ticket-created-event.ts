import { Subjects } from "./subject";

export interface TicketCreateEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  }
}