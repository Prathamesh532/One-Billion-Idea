import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderWebSocketGateway } from './websocket/websocket.gateway';

@Controller()
export class OrdersListenerController {
  private readonly logger = new Logger(OrdersListenerController.name);

  constructor(private readonly ordersGateway: OrderWebSocketGateway) {}

  @EventPattern('order_updated')
  async handleOrderUpdated(@Payload() data: any) {
    this.logger.log(`Order updated event received: ${JSON.stringify(data)}`);
    this.ordersGateway.sendOrderUpdate(data);
  }

  @EventPattern('order_created')
  async handleOrderCreated(@Payload() data: any) {
    this.logger.log(`Order created event received: ${JSON.stringify(data)}`);
    this.ordersGateway.sendOrderCreate(data);
  }
}
