import { Module } from '@nestjs/common';
import { OrderWebSocketGateway } from './websocket.gateway';
import { OrdersListenerController } from '../order-events.controller';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module'; // Add this

@Module({
  imports: [RabbitMQModule], // Add RabbitMQModule import
  controllers: [OrdersListenerController],
  providers: [OrderWebSocketGateway],
})
export class WebSocketModule {}
