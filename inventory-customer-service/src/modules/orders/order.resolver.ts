import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Subscription,
} from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '../../common/enum/order-status.enum';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => Order)
  createOrder(@Args('createOrderDto') createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Query(() => [Order], { name: 'orders' })
  findAll() {
    return this.orderService.findAll();
  }

  @Query(() => Order, { name: 'order' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.orderService.findById(id);
  }

  @Query(() => [Order], { name: 'ordersByCustomer' })
  findByCustomerId(@Args('customerId') customerId: string) {
    return this.orderService.findByCustomerId(customerId);
  }

  @Mutation(() => Order)
  updateOrderStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => OrderStatus }) status: OrderStatus,
  ) {
    return this.orderService.updateStatus(id, status);
  }

  @Subscription(() => Order)
  orderStatusUpdated() {
    return this.orderService.getOrderStatusSubscription();
  }
}
