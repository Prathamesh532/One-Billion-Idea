import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthService, AuthResponse } from '../auth/auth.service';
import { Customer } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { LoginCustomerDto } from './dto/login-customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(
    private readonly customerService: CustomerService,
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => AuthResponse)
  register(@Args('createCustomerDto') createCustomerDto: CreateCustomerDto) {
    return this.authService.register(createCustomerDto);
  }

  @Mutation(() => AuthResponse)
  login(@Args('loginCustomerDto') loginCustomerDto: LoginCustomerDto) {
    return this.authService.login(loginCustomerDto);
  }

  @Query(() => [Customer], { name: 'customers' })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.customerService.findAll();
  }

  @Query(() => Customer, { name: 'customer' })
  @UseGuards(JwtAuthGuard)
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.customerService.findById(id);
  }

  @Query(() => Customer, { name: 'me' })
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() customer: Customer) {
    return customer;
  }

  @Mutation(() => Customer)
  @UseGuards(JwtAuthGuard)
  updateCustomer(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateCustomerDto') updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Mutation(() => Customer)
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @CurrentUser() customer: Customer,
    @Args('updateCustomerDto') updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(customer._id, updateCustomerDto);
  }

  @Mutation(() => Customer)
  @UseGuards(JwtAuthGuard)
  removeCustomer(@Args('id', { type: () => ID }) id: string) {
    return this.customerService.remove(id);
  }
}
