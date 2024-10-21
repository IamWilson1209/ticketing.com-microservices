import request from 'supertest';
import { app } from '../../app';
import { getCookiesForSignedInTest } from '../../test/getCookiesForSigninTest';

it('response with detail of current user', async () => {
  const cookie = await getCookiesForSignedInTest();

  if (!cookie) {
    throw new Error('Cookie not set after signup');
  }
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('response with null if no current user', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});