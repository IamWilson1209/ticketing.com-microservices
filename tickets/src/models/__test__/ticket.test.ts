import { Ticket } from '../ticket';

it('implement optimistic concurrency for ticket model', async () => {
  const ticket = Ticket.build({
    title: 'Test Ticket',
    price: 10,
    userId: 'abc123',
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 20 });
  secondInstance!.set({ price: 30 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }
  throw new Error('Should not reach this line');
});


it('incremet verison number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'Test Ticket',
    price: 10,
    userId: 'abc123',
  });

  await ticket.save();  // v1
  expect(ticket.version).toBe(0);
  await ticket.save();
  expect(ticket.version).toBe(1);
  await ticket.save();
  expect(ticket.version).toBe(2);
});
