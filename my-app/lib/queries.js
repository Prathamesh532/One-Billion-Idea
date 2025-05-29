import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query Products {
    products {
      _id
      name
      description
      price
      stock
      category
      imageUrl
      isActive
    }
  }
`;

export const GET_PRODUCT = gql`
  query Product($id: ID!) {
    product(id: $id) {
      _id
      name
      description
      price
      stock
      category
      imageUrl
      isActive
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($createProductDto: CreateProductDto!) {
    createProduct(createProductDto: $createProductDto) {
      _id
      name
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $updateProductDto: UpdateProductDto!) {
    updateProduct(id: $id, updateProductDto: $updateProductDto) {
      _id
      name
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation RemoveProduct($id: ID!) {
    removeProduct(id: $id) {
      _id
    }
  }
`;
