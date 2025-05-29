import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OrderHistory,
  OrderHistoryDocument,
} from './schemas/order-history.schema';
import { CreateOrderHistoryDto } from './dto/order-history.dto';
import { OrderEvent } from '../../common/interfaces/order-event.interface';

@Injectable()
export class OrderHistoryService {
  constructor(
    @InjectModel(OrderHistory.name)
    private orderHistoryModel: Model<OrderHistoryDocument>,
  ) {}

  async createFromOrderEvent(orderEvent: OrderEvent): Promise<OrderHistory> {
    const orderHistory = new this.orderHistoryModel({
      orderId: orderEvent.orderId,
      customerId: orderEvent.customerId,
      items: orderEvent.items,
      totalAmount: orderEvent.totalAmount,
      status: orderEvent.status,
      orderDate: orderEvent.createdAt,
    });

    return orderHistory.save();
  }

  async create(
    createOrderHistoryDto: CreateOrderHistoryDto,
  ): Promise<OrderHistory> {
    const createdOrderHistory = new this.orderHistoryModel(
      createOrderHistoryDto,
    );
    return createdOrderHistory.save();
  }

  async findAll(): Promise<OrderHistory[]> {
    return this.orderHistoryModel.find().sort({ orderDate: -1 }).exec();
  }

  async findByCustomerId(customerId: string): Promise<OrderHistory[]> {
    return this.orderHistoryModel
      .find({ customerId })
      .sort({ orderDate: -1 })
      .exec();
  }

  async findByOrderId(orderId: string): Promise<OrderHistory> {
    const orderHistory = await this.orderHistoryModel
      .findOne({ orderId })
      .exec();
    if (!orderHistory) {
      throw new NotFoundException(
        `Order history with order ID ${orderId} not found`,
      );
    }
    return orderHistory;
  }

  async updateStatus(orderId: string, status: string): Promise<OrderHistory> {
    const updatedOrderHistory = await this.orderHistoryModel
      .findOneAndUpdate({ orderId }, { status }, { new: true })
      .exec();

    if (!updatedOrderHistory) {
      throw new NotFoundException(
        `Order history with order ID ${orderId} not found`,
      );
    }
    return updatedOrderHistory;
  }

  async getCustomerStats(customerId: string): Promise<any> {
    const stats = await this.orderHistoryModel
      .aggregate([
        { $match: { customerId } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: '$totalAmount' },
            averageOrderValue: { $avg: '$totalAmount' },
          },
        },
      ])
      .exec();

    return stats[0] || { totalOrders: 0, totalSpent: 0, averageOrderValue: 0 };
  }
}
