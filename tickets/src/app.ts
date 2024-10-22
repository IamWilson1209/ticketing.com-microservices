import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@weitickets/common';
import { createTicketRouter } from './routes/new';

const app = express();
app.set('trust proxy', true); // Express trust proxy
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test', // Only set cookies over HTTPS，但是supertest不是！
}))

app.use(currentUser);
app.use(createTicketRouter);


app.get('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };