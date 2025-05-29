import { InputType, Field, Float, Int } from '@nestjs/graphql';
import {
  IsString,
  IsNumber,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
class OrderHistoryItemDto {
  @Field()
  @IsString()
  productId: string;

  @Field()
  @IsString()
  productName: string;

  @Field(() => Int)
  @IsNumber()
  quantity: number;

  @Field(() => Float)
  @IsNumber()
  price: number;
}

@InputType()
export class CreateOrderHistoryDto {
  @Field()
  @IsString()
  orderId: string;

  @Field()
  @IsString()
  customerId: string;

  @Field(() => [OrderHistoryItemDto])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderHistoryItemDto)
  items: OrderHistoryItemDto[];

  @Field(() => Float)
  @IsNumber()
  totalAmount: number;

  @Field()
  @IsString()
  status: string;

  @Field()
  @IsDateString()
  orderDate: Date;
}
