import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import { OrderEvent } from '../../common/interfaces/order-event.interface';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private readonly exchangeName = 'order_events';
  private readonly queueName = 'customer_service_queue';

  async onModuleInit() {
    try {
      // Use the default import directly
      this.connection = await amqp.connect(
        process.env.RABBITMQ_URL || 'amqp://localhost:5672',
      );

      // Type assertion if needed
      this.channel = await (this.connection as amqp.Connection).createChannel();

      await this.channel.assertExchange(this.exchangeName, 'direct', {
        durable: true,
      });
      await this.channel.assertQueue(this.queueName, { durable: true });
      await this.channel.bindQueue(
        this.queueName,
        this.exchangeName,
        'order.created',
      );

      console.log('RabbitMQ connected and configured');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
      }
      if (this.connection) {
        await (this.connection as amqp.Connection).close();
        this.connection = null;
      }
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
    }
  }

  async publishOrderEvent(orderEvent: OrderEvent): Promise<void> {
    console.log('Attempting to publish order event:', orderEvent.orderId); // Add this
    try {
      if (!this.channel) {
        throw new Error('RabbitMQ channel not available');
      }

      const message = Buffer.from(JSON.stringify(orderEvent));
      console.log('Publishing message to exchange:', this.exchangeName); // Add this
      this.channel.publish(this.exchangeName, 'order.created', message, {
        persistent: true,
      });

      console.log('Order event published successfully:', orderEvent.orderId);
    } catch (error) {
      console.error('Failed to publish order event:', error);
      throw error;
    }
  }
}
