import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomerService } from '../customers/customer.service';
import { CreateCustomerDto } from '../customers/dto/create-customer.dto';
import { LoginCustomerDto } from '../customers/dto/login-customer.dto';
import { Customer } from '../customers/schemas/customer.schema';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import * as bcrypt from 'bcryptjs';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field(() => Customer)
  customer: Customer;
}

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomerService,
    private jwtService: JwtService,
  ) {}

  async register(createCustomerDto: CreateCustomerDto): Promise<AuthResponse> {
    try {
      const customer = await this.customerService.create(createCustomerDto);
      const payload: JwtPayload = {
        sub: customer._id,
        email: customer.email,
        // role: customer.role,
      };

      return {
        access_token: this.jwtService.sign(payload),
        customer,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async login(loginCustomerDto: LoginCustomerDto): Promise<AuthResponse> {
    const customer = await this.validateCustomer(
      loginCustomerDto.email,
      loginCustomerDto.password,
    );

    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: customer._id,
      email: customer.email,
      // role: customer.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      customer,
    };
  }

  async validateCustomer(
    email: string,
    password: string,
  ): Promise<Customer | null> {
    const customer = await this.customerService.findByEmail(email);

    if (customer && (await bcrypt.compare(password, customer.password))) {
      return customer;
    }

    return null;
  }

  async validateJwtPayload(payload: JwtPayload): Promise<Customer> {
    return this.customerService.findById(payload.sub);
  }
}
