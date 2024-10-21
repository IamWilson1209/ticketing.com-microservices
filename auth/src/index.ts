import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  // Check if JWT_KEY is defined in environment variables
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Error connecting to MongoDB', error);
  }
};

start();

app.listen(3000, () => {
  console.log('Am I working? Server is running on port 3000!!!!!');
});
