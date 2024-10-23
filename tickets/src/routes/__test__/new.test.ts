import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { getCookiesForSignedInTest } from '../../test/getCookiesForSigninTest';

it('has route handler listening to /api/tickets for posts requests', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if user is signed in', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if user is signed in', async () => {
  const cookie = getCookiesForSignedInTest();

  try {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({});
    expect(response.status).not.toEqual(401);
  } catch (error) {
    console.error('Error occurred:', error);
  }
});

it('returns an eror if an invalid title is provided', async () => {
  const cookie = getCookiesForSignedInTest();
  await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: '',
    price: 10,
  }).expect(400);

  await request(app).post('/api/tickets').set('Cookie', cookie).send({
    price: 10,
  }).expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  const cookie = getCookiesForSignedInTest();
  await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: 'ghwoghwo',
    price: -10,
  }).expect(400);

  await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: 'ghegihwi',
  }).expect(400);

});

it('creates a ticket when valid inputs is provided', async () => {

  let tickets = await Ticket.find({});
  expect(tickets.length).toBe(0);

  const cookie = getCookiesForSignedInTest();
  await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: 'grwhehe',
    price: 20,
  }).expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toBe(1);
  expect(tickets[0].title).toEqual('grwhehe');
  expect(tickets[0].price).toEqual(20);

});
