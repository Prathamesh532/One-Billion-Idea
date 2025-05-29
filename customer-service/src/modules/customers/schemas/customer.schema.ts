import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

export type CustomerDocument = Customer & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Customer {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  firstName: string;

  @Field()
  @Prop({ required: true })
  lastName: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Field({ nullable: true })
  @Prop()
  phone?: string;

  @Field({ nullable: true })
  @Prop()
  address?: string;

  @Field({ nullable: true })
  @Prop()
  city?: string;

  @Field({ nullable: true })
  @Prop()
  country?: string;

  @Field({ nullable: true })
  @Prop()
  zipCode?: string;

  @Prop({ default: 'customer' }) // default role
  role: 'customer' | 'admin'; // Add as many roles as needed

  @Field()
  @Prop({ default: true })
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

// Index for email uniqueness
CustomerSchema.index({ email: 1 }, { unique: true });
