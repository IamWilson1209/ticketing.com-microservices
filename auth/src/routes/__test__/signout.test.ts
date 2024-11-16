import request from 'supertest';
import { app } from '../../app';

it('clear cookie after signing out', async () => {
  const signinResponse = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
      firstName: 'firstName',
      lastName: 'lastName',
      phoneNumber: '0965650099',
    })
    .expect(201);

  console.log('signin cookie: ', signinResponse.get('Set-Cookie'))

  const signoutResponse = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  const cookie = signoutResponse.get('Set-Cookie');
  if (!cookie) {
    throw new Error('Expected cookie but got undefined.');
  }

  console.log('signout cookie: ', signoutResponse.get('Set-Cookie'))

  expect(cookie[0]).toEqual(
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
