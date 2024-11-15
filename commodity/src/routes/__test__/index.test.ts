import request from 'supertest';
import { app } from '../../app';
import { getCookiesForSignedInTest } from '../../test/getCookiesForSigninTest';
import { Category } from '../../models/commodity';

it('A user can fetch a list of commodity', async () => {
  await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', getCookiesForSignedInTest())
    .send({
      title: 'Test Ticket 1',
      price: 10,
      category: Category.Books,
    });
  await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', getCookiesForSignedInTest())
    .send({
      title: 'Test Ticket 2',
      price: 20,
      category: Category.Electronics,
    });
  const response = await request(app).get('/api/tickets').send({}).expect(200);
  expect(response.body.length).toEqual(2);
  expect(response.body[0].title).toEqual("Test Ticket 1");
  expect(response.body[0].price).toEqual(10);
  expect(response.body[0].category).toEqual(Category.Books);
  expect(response.body[1].title).toEqual("Test Ticket 2");
  expect(response.body[1].price).toEqual(20);
  expect(response.body[1].category).toEqual(Category.Electronics);
});
