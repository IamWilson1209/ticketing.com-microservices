import request from 'supertest';
import { app } from '../../app';
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
  console.log('Cookie:', cookie);

  try {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({});
    console.log('response.status: ', response.status);
    expect(response.status).not.toEqual(401);
  } catch (error) {
    console.error('Error occurred:', error);
  }
});

it('returns an eror if an invalid title is provide', async () => {

});

it('returns an error if an invalid title is provided', async () => { });

it('returns an error is an invalid price is provided', async () => { });
