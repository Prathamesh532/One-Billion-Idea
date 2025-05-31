// orders.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
@WebSocketGateway()
export class OrdersGateway {
  @WebSocketServer() server: Server;

  sendOrderUpdate(data: { orderId: string; status: string }) {
    this.server.to(`order_${data.orderId}`).emit('order_update', data);
  }

  sendOrderCreate(data: { orderId: string; status: string }) {
    this.server.to(`order_${data.orderId}`).emit('order_create', data);
  }
}
