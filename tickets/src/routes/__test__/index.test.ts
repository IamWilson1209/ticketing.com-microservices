import request from 'supertest';
import { Ticket } from '../../models/ticket';
import { app } from '../../app';
import { getCookiesForSignedInTest } from '../../test/getCookiesForSigninTest';

it('can fetch a list of tickets', async () => {
  await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', getCookiesForSignedInTest())
    .send({
      title: 'Test Ticket 1',
      price: 10,
    });
  await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', getCookiesForSignedInTest())
    .send({
      title: 'Test Ticket 2',
      price: 10,
    });
  const response = await request(app).get('/api/tickets').send({}).expect(200);
  expect(response.body.length).toEqual(2);
});
