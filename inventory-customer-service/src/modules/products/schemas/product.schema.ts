import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

export type ProductDocument = Product & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Product {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  description: string;

  @Field(() => Float)
  @Prop({ required: true })
  price: number;

  @Field(() => Int)
  @Prop({ required: true, default: 0 })
  stock: number;

  @Field()
  @Prop({ required: true })
  category: string;

  @Field({ nullable: true })
  @Prop({ required: true })
  imageUrl?: string;

  @Field()
  @Prop({ default: true })
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
