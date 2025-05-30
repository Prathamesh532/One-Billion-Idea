// src/modules/websocket/websocket.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as amqp from 'amqplib';
import { Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class OrderWebSocketGateway implements OnGatewayInit {
  constructor(@Inject('ORDER_SERVICE') private readonly client: ClientProxy) {}

  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(OrderWebSocketGateway.name);
  private connection: amqp.ChannelModel;
  private channel: amqp.Channel;

  async afterInit() {
    try {
      this.logger.log('Connecting to RabbitMQ...');
      this.connection = await amqp.connect('amqp://localhost');

      this.connection.on('close', () =>
        this.logger.warn('RabbitMQ connection closed'),
      );
      this.connection.on('error', (err) =>
        this.logger.error('RabbitMQ connection error', err),
      );

      this.channel = await this.connection.createChannel();
      this.logger.log('RabbitMQ channel created');

      const exchange = 'order_updates';
      await this.channel.assertExchange(exchange, 'topic', { durable: false });
      this.logger.log(`Exchange '${exchange}' asserted`);

      const queue = await this.channel.assertQueue('', { exclusive: true });
      await this.channel.bindQueue(queue.queue, exchange, 'order.status.*');
      this.logger.log(
        `Queue bound to exchange with routing pattern 'order.status.*'`,
      );

      this.channel.consume(queue.queue, (msg) => {
        if (msg) {
          this.logger.debug(`Received message: ${msg.content.toString()}`);
          const message = JSON.parse(msg.content.toString());
          this.server
            .to(`order_${message.orderId}`)
            .emit('order_update', message);
          this.channel.ack(msg);
        }
      });
    } catch (err) {
      this.logger.error('RabbitMQ initialization failed', err.stack);
    }
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe_order')
  handleOrderSubscription(@MessageBody() data: { orderId: string }) {
    console.log(`Subscribed to order ID: ${data.orderId}`);
    // Store or map client to orderId if needed
  }

  // You can use this to emit updates manually:
  sendOrderUpdate(data: { orderId: string; status: string }) {
    this.server.to(`order_${data.orderId}`).emit('order_update', data);
  }

  @SubscribeMessage('subscribe_order')
  handleSubscribe(client: Socket, payload: { orderId: string }) {
    if (payload?.orderId) {
      client.join(`order_${payload.orderId}`);
      this.logger.log(`Client joined room: order_${payload.orderId}`);
    }
  }
}
