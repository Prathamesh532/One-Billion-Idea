import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';

@InputType()
export class CreateOrderDto {
  @Field()
  @IsString()
  customerId: string;

  @Field(() => [OrderItemDto])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @Field({ nullable: true })
  @IsString()
  shippingAddress?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
