import { Commodity } from '../commodity';
import { Category } from '../commodity';

it('implement optimistic concurrency for commodity model', async () => {
  const commodity = Commodity.build({
    title: 'Test Commodity',
    price: 10,
    userId: 'abc123',
    category: Category.Books,
  });

  await commodity.save();

  const firstInstance = await Commodity.findById(commodity.id);
  const secondInstance = await Commodity.findById(commodity.id);

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
  const commodity = Commodity.build({
    title: 'Test Commodity',
    price: 10,
    userId: 'abc123',
    category: Category.Books,
  });

  await commodity.save();  // v1
  expect(commodity.version).toBe(0);
  await commodity.save();
  expect(commodity.version).toBe(1);
  await commodity.save();
  expect(commodity.version).toBe(2);
});
