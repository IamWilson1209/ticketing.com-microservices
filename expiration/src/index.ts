import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listener/order-created-listener';

const start = async () => {
  console.log('hi from dev')
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close()); // 出現Interrupted signal (CTRL+C)時，結束NATS連線
    process.on('SIGTERM', () => natsWrapper.client.close()); // 出現 Terminated signal (kill)時，結束NATS連線

    new OrderCreatedListener(natsWrapper.client).listen();

  } catch (error) {
    console.log('Error connecting to MongoDB', error);
  }
};

start();
