import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
class OrderHistoryItem {
  @Field(() => ID)
  productId: string;

  @Field()
  productName: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;
}

export type OrderHistoryDocument = OrderHistory & Document;

@ObjectType()
@Schema({ timestamps: true })
export class OrderHistory {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  orderId: string;

  @Field()
  @Prop({ required: true, type: Types.ObjectId, ref: 'Customer' })
  customerId: string;

  @Field(() => [OrderHistoryItem])
  @Prop([
    {
      productId: { type: String, required: true },
      productName: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ])
  items: OrderHistoryItem[];

  @Field(() => Float)
  @Prop({ required: true })
  totalAmount: number;

  @Field()
  @Prop({ required: true })
  status: string;

  @Field()
  @Prop({ required: true })
  orderDate: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const OrderHistorySchema = SchemaFactory.createForClass(OrderHistory);

// Index for efficient customer queries
OrderHistorySchema.index({ customerId: 1, orderDate: -1 });
