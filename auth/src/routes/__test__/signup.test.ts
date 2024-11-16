import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
      firstName: 'firstName',
      lastName: 'lastName',
      phoneNumber: '0965650099',
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'gfuqeghiqgi',
      password: 'password',
      firstName: 'firstName',
      lastName: 'lastName',
      phoneNumber: '0965650099',
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'gfuqeghiqgi',
      password: 'p',
      firstName: 'firstName',
      lastName: 'lastName',
      phoneNumber: '0965650099',
    })
    .expect(400);
});

it('returns a 400 with missing email or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      firstName: 'firstName',
      lastName: 'lastName',
      phoneNumber: '0965650099',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'password',
      firstName: 'firstName',
      lastName: 'lastName',
      phoneNumber: '0965650099',
    })
    .expect(400);
});

it('disallow duplicate emails or phoneNumber', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
      firstName: 'firstName',
      lastName: 'lastName',
      phoneNumber: '0965650099',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
      firstName: 'firstName',
      lastName: 'lastName',
      phoneNumber: '0965650099',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'wwwww@test.com',
      password: 'password',
      firstName: 'firstName',
      lastName: 'lastName',
      phoneNumber: '0965650099',
    })
    .expect(400);
});

it('sets cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
      firstName: 'firstName',
      lastName: 'lastName',
      phoneNumber: '0965650099',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
