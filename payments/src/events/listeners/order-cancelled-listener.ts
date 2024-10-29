import { Listener, OrderStatus, Subjects } from "@weitickets/common";
import { OrderCancelledEvent } from "@weitickets/common";
import { queueGroupName } from "./queueGroupName";
import { Order } from "../../models/order";
import { Message } from "node-nats-streaming";


export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1, // 為了在未來有更新order的能力
    });
    if (!order) {
      throw new Error('Order not found');
    }
    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}