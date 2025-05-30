// lib/graphql/orders.js
import { gql } from "@apollo/client";

export const GET_ORDERS = gql`
  query GetOrders {
    orders {
      _id
      customerId
      products {
        productId
        quantity
      }
      totalAmount
      status
      createdAt
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($createOrderDto: CreateOrderDto!) {
    createOrder(createOrderDto: $createOrderDto) {
      _id
      customerId
      products {
        productId
        quantity
      }
      totalAmount
      status
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $status: String!) {
    updateOrderStatus(id: $id, status: $status) {
      _id
      status
    }
  }
`;
