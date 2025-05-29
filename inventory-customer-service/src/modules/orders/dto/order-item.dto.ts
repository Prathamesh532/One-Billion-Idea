import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsString, IsNumber, Min } from 'class-validator';

@InputType()
export class OrderItemDto {
  @Field(() => ID)
  @IsString()
  productId: string;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  quantity: number;
}
