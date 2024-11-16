import request from 'supertest';
import { app } from '../../app';
import { Commodity } from '../../models/commodity';
import { getCookiesForSignedInTest } from '../../test/getCookiesForSigninTest';
import { natsWrapper } from '../../nats-wrapper';
import { Category, TagCategory } from '@weitickets/common';

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
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({});
  expect(response.status).not.toEqual(401);
});

it('returns an eror if an invalid title is provided', async () => {
  const cookie = getCookiesForSignedInTest();
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 10,
      category: Category.Electronics,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      price: 10,
      category: Category.Electronics,
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  const cookie = getCookiesForSignedInTest();
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'ghwoghwo',
      price: -10,
      category: Category.Electronics,
    })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'ghegihwi',
      category: Category.Electronics,
    })
    .expect(400);
});

it('returns an error if an invalid category is provided', async () => {
  const cookie = getCookiesForSignedInTest();
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'ghwoghwo',
      price: 10,
      category: 'fhiwhifohq',
    })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'ghegihwi',
      price: 10,
    })
    .expect(400);
});

it('returns an error if an invalid tags is provided', async () => {
  const cookie = getCookiesForSignedInTest();
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'ghwoghwo',
      price: 10,
      category: Category.Electronics,
      tags: ['tag1', 'tag2'],
    })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'ghegihwi',
      price: 10,
      category: Category.Electronics,
      tags: 10,
    })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'ghegihwi',
      price: 10,
      category: Category.Electronics,
      tags: 'oooo',
    })
    .expect(400);
});

it('creates a commodity when valid inputs is provided', async () => {
  let commodities = await Commodity.find({});
  expect(commodities.length).toBe(0);

  const cookie = getCookiesForSignedInTest();
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'grwhehe',
      price: 20,
      category: Category.Electronics,
      tags: [TagCategory.Business, TagCategory.Fashion],
    })
    .expect(201);

  commodities = await Commodity.find({});
  expect(commodities.length).toBe(1);

  const commodity = await Commodity.findById(commodities[0].id).populate('tags');
  expect(commodity?.title).toEqual('grwhehe');
  expect(commodity?.price).toEqual(20);
  expect(commodity?.category).toEqual(Category.Electronics);
  expect(commodity?.tags.length).toBe(2);
});

it('publishes an event', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', getCookiesForSignedInTest())
    .send({
      title: 'grwhehe',
      price: 20,
      category: Category.Electronics,
      desc: 'description',
      tags: [TagCategory.Business, TagCategory.Fashion],
    })
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
