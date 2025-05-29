import { InputType, Field, Float, Int, PartialType } from '@nestjs/graphql';
import { CreateProductDto } from './create-product.dto';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateProductDto extends PartialType(CreateProductDto) {
  @Field(() => Float, { nullable: true })
  @IsOptional()
  price?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  stock?: number;

  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  imageUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  isActive?: boolean;
}
