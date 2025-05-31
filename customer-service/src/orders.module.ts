import { Module } from '@nestjs/common';
import { OrdersListenerController } from './orders-listener.controller';
import { OrdersGateway } from './orders.gateway';

@Module({
  controllers: [OrdersListenerController],
  providers: [OrdersGateway],
  exports: [OrdersGateway],
})
export class OrdersModule {}
