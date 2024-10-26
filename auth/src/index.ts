import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  console.log('Auth service is starting up successfullyyyy...')
  // Check if JWT_KEY is defined in environment variables
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Auth service Connected to MongoDB');
  } catch (error) {
    console.log('Error connecting to MongoDB', error);
  }
};

start();

app.listen(3000, () => {
  console.log('Auth service is running on port 3000!!!!!');
});
