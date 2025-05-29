import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { OrderHistoryModule } from '../order-history/order-history.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, OrderHistoryModule],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
