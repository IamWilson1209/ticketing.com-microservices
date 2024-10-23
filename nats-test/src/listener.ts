import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './event/ticket-created-listner';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});
stan.on('connect', () => {
  console.log('Connected to NATS');

  // 出現任何close情況時，踢出code
  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  })

  new TicketCreatedListener(stan).listen();

  // // setManualAckMode to true to receive messages manually
  // // 人工決定要把event傳給誰，否則出意外可能會失去event
  // // 過了一陣子如果沒有人工確認，NAts會在傳給別的listener
  // const options = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true)
  //   .setDeliverAllAvailable() // 1. 紀錄所有存在的event，取得過去所有event防止記錄不見
  //   .setDurableName('order-service'); // 2. 確保斷線之後會重新送出missing event

  // const subscription = stan.subscribe(
  //   'ticketing:created',
  //   'queue-group-name', // 3. 確保不會意外丟失setDurableName，確保發出的event只存在於一個listener上
  //   options
  // );

  // subscription.on('message', (msg: Message) => {
  //   const data = msg.getData();

  //   if (typeof data == 'string') {
  //     console.log(`Received message ${msg.getSequence()}, with data ${data}`);
  //   }

  //   msg.ack(); // acknowledge the message

  // });
});


process.on('SIGINT', () => stan.close()); // 出現Interrupted signal (CTRL+C)時，結束NATS連線
process.on('SIGTERM', () => stan.close()); // 出現 Terminated signal (kill)時，結束NATS連線