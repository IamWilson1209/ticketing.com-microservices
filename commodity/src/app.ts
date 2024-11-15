import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@weitickets/common';
import { createCommodityRouter } from './routes/create.route';
import { getCommodityByIdRouter } from './routes/getbyid.route';
import { getAllCommodityRouter } from './routes/getall.route';
import { updateCommodityRouter } from './routes/update.route';

const app = express();
app.set('trust proxy', true); // Express trust proxy
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test', // Only set cookies over HTTPS，但是supertest不是！
}))

app.use(currentUser);
app.use(createCommodityRouter);
app.use(getCommodityByIdRouter);
app.use(getAllCommodityRouter);
app.use(updateCommodityRouter)


app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };