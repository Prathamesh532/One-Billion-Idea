import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateCustomerDto } from './create-customer.dto';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @Field({ nullable: true })
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  country?: string;

  @Field({ nullable: true })
  @IsOptional()
  zipCode?: string;
}
