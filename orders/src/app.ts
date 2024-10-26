import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@weitickets/common';
import { indexOrdersRouter } from './routes/index';
import { deleteOrdersRouter } from './routes/delete';
import { newOrdersRouter } from './routes/new';
import { showOrdersRouter } from './routes/show';


const app = express();
app.set('trust proxy', true); // Express trust proxy
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test', // Only set cookies over HTTPS，但是supertest不是！
}))

app.use(currentUser);
app.use(indexOrdersRouter);
app.use(deleteOrdersRouter);
app.use(newOrdersRouter);
app.use(showOrdersRouter)


app.get('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };