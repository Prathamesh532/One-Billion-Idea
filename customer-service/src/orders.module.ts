import { Module } from '@nestjs/common';
import { OrdersListenerController } from './orders-listener.controller';
import { OrdersGateway } from './orders.gateway';

@Module({
  controllers: [OrdersListenerController],
  providers: [OrdersGateway], // <--- This is critical!
  exports: [OrdersGateway], // optional, if you need to use it elsewhere
})
export class OrdersModule {}
