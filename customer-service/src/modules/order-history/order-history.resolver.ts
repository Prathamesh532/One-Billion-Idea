import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrderHistoryService } from './order-history.service';
import { OrderHistory } from './schemas/order-history.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Customer } from '../customers/schemas/customer.schema';
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
class CustomerStats {
  @Field(() => Int)
  totalOrders: number;

  @Field(() => Float)
  totalSpent: number;

  @Field(() => Float)
  averageOrderValue: number;
}

@Resolver(() => OrderHistory)
export class OrderHistoryResolver {
  constructor(private readonly orderHistoryService: OrderHistoryService) {}

  @Query(() => [OrderHistory], { name: 'orderHistories' })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.orderHistoryService.findAll();
  }

  @Query(() => [OrderHistory], { name: 'myOrderHistory' })
  @UseGuards(JwtAuthGuard)
  findMyOrderHistory(@CurrentUser() customer: Customer) {
    return this.orderHistoryService.findByCustomerId(customer._id);
  }

  @Query(() => [OrderHistory], { name: 'customerOrderHistory' })
  @UseGuards(JwtAuthGuard)
  findByCustomerId(@Args('customerId', { type: () => ID }) customerId: string) {
    return this.orderHistoryService.findByCustomerId(customerId);
  }

  @Query(() => OrderHistory, { name: 'orderHistoryByOrderId' })
  @UseGuards(JwtAuthGuard)
  findByOrderId(@Args('orderId') orderId: string) {
    return this.orderHistoryService.findByOrderId(orderId);
  }

  @Query(() => CustomerStats, { name: 'myStats' })
  @UseGuards(JwtAuthGuard)
  getMyStats(@CurrentUser() customer: Customer) {
    return this.orderHistoryService.getCustomerStats(customer._id);
  }

  @Query(() => CustomerStats, { name: 'customerStats' })
  @UseGuards(JwtAuthGuard)
  getCustomerStats(@Args('customerId', { type: () => ID }) customerId: string) {
    return this.orderHistoryService.getCustomerStats(customerId);
  }
}
