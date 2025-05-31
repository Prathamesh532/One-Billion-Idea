import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib'; // Import the entire namespace
import { OrderEvent } from '../../common/interfaces/order-event.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private readonly queueName = 'order_events';
  private readonly exchangeName = 'order_exchange';
  private readonly routingKey = 'order.*';

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.init();
  }

  async onModuleDestroy() {
    await this.close();
  }

  private async init() {
    try {
      const rabbitmqUrl = this.configService.get<string>(
        'RABBITMQ_URL',
        'amqp://localhost:5672',
      );

      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();

      if (!this.channel) {
        throw new Error('Failed to create RabbitMQ channel.');
      }

      await this.channel.assertExchange(this.exchangeName, 'topic', {
        durable: true,
      });

      await this.channel.assertQueue(this.queueName, { durable: true });

      await this.channel.bindQueue(
        this.queueName,
        this.exchangeName,
        this.routingKey,
        {},
      );

      await this.consumeOrderEvents();

      console.log('RabbitMQ connection established');
    } catch (error) {
      console.error('RabbitMQ connection failed:', error);
      throw error;
    }
  }

  private async close() {
    if (this.channel) {
      await this.channel.close();
      this.channel = null;
    }
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }

  private async consumeOrderEvents() {
    if (!this.channel) throw new Error('Channel not initialized');

    await this.channel.consume(
      this.queueName,
      async (message: amqp.ConsumeMessage | null) => {
        if (message) {
          try {
            const content = message.content.toString();
            const orderEvent: OrderEvent = JSON.parse(content);
            this.channel!.ack(message);
          } catch (error) {
            console.error('Message processing failed:', error);
            this.channel!.nack(message, false, false);
          }
        }
      },
      { noAck: false },
    );
  }

  publishEvent(exchange: string, routingKey: string, message: unknown) {
    if (!this.channel) throw new Error('Channel not initialized');

    this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );
  }
}
