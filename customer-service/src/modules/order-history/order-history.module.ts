import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderHistoryService } from './order-history.service';
import { OrderHistoryResolver } from './order-history.resolver';
import {
  OrderHistory,
  OrderHistorySchema,
} from './schemas/order-history.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderHistory.name, schema: OrderHistorySchema },
    ]),
    AuthModule,
  ],
  providers: [OrderHistoryResolver, OrderHistoryService],
  exports: [OrderHistoryService],
})
export class OrderHistoryModule {}
