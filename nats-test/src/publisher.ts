import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './event/ticket-created-publisher';

console.clear();


// client side (publisher)
const stan = nats.connect('ticketing', 'abc', { url: 'nats://localhost:4222' });

stan.on('connect', async () => {

  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      title: 'My First Ticket',
      price: 19.99,
    });
  } catch (error) {
    console.error('Error publishing event', error);
  }

  // stan.publish('ticketing:created', data, () => {
  //   console.log('Event published')
  // })

})