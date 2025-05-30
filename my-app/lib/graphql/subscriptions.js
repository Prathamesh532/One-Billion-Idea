import { gql } from "@apollo/client";

export const ORDER_STATUS_SUBSCRIPTION = gql`
  subscription OrderStatusUpdated($customerId: ID!) {
    orderStatusUpdated(customerId: $customerId) {
      _id
      status
      items {
        productId
        productName
        quantity
        price
      }
      totalAmount
      createdAt
      updatedAt
    }
  }
`;
