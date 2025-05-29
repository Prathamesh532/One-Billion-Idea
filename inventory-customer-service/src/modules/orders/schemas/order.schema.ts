import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { OrderStatus } from '../../../common/enum/order-status.enum';

@ObjectType()
class OrderItem {
  @Field(() => ID)
  productId: string;

  @Field()
  productName: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;
}

export type OrderDocument = Order & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Order {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  customerId: string;

  @Field(() => [OrderItem])
  @Prop([
    {
      productId: { type: Types.ObjectId, required: true },
      productName: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ])
  items: OrderItem[];

  @Field(() => Float)
  @Prop({ required: true })
  totalAmount: number;

  @Field(() => OrderStatus)
  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Field({ nullable: true })
  @Prop()
  shippingAddress?: string;

  @Field({ nullable: true })
  @Prop()
  notes?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
