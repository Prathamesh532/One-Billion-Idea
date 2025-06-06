import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CustomerModule } from './modules/customers/customer.module';
import { AuthModule } from './modules/auth/auth.module';
import { RabbitMQModule } from './modules/rabbitmq/rabbitmq.module';
import { OrdersListenerController } from './orders-listener.controller';
import { OrdersModule } from './orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/customer_db',
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      introspection: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    CustomerModule,
    AuthModule,
    RabbitMQModule,
    OrdersModule,
  ],
  controllers: [OrdersListenerController],
})
export class AppModule {}
