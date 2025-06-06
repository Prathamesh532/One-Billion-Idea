import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '../../common/enum/order-status.enum';
import { ProductService } from '../products/product.service';
// import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { OrderEvent } from '../../common/interfaces/order-event.interface';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common/decorators';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrderService {
  private pubSub = new PubSub();

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @Inject('ORDER_SERVICE') private readonly client: ClientProxy,
    private productService: ProductService,
    // private rabbitMQService: RabbitMQService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { items, customerId, shippingAddress, notes } = createOrderDto;

    // Validate products and check availability
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await this.productService.findById(item.productId);

      if (
        !(await this.productService.checkAvailability(
          item.productId,
          item.quantity,
        ))
      ) {
        throw new BadRequestException(
          `Insufficient stock for product: ${product.name}`,
        );
      }

      orderItems.push({
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
      });

      totalAmount += product.price * item.quantity;
    }

    // Create order
    const createdOrder = new this.orderModel({
      customerId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      notes,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await createdOrder.save();

    // Update product stock
    for (const item of items) {
      await this.productService.updateStock(item.productId, item.quantity);
    }

    // Publish order event to RabbitMQ
    const orderEvent = {
      orderId: savedOrder._id.toString(),
      customerId: savedOrder.customerId.toString(),
      items: savedOrder.items.map((item) => ({
        productId: item.productId.toString(),
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      totalAmount: savedOrder.totalAmount,
      shippingAddress: savedOrder.shippingAddress,
      notes: savedOrder.notes || null,
      status: savedOrder.status,
      createdAt: savedOrder.createdAt.toISOString(),
    };

    this.client.emit('order_created', orderEvent);

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    return this.orderModel.find({ customerId }).exec();
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();

    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    this.client.emit('order_updated', {
      orderId: id,
      status,
      timestamp: new Date().toISOString(),
    });

    return updatedOrder;
  }

  getOrderStatusSubscription() {
    return (
      this.pubSub as unknown as {
        asyncIterator: (trigger: string) => AsyncIterator<any>;
      }
    ).asyncIterator('orderStatusUpdated');
  }
}
