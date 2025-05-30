// lib/graphql/products.js
import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      _id
      name
      description
      price
      category
      stock
      isActive
      imageUrl
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      _id
      name
      description
      price
      category
      stock
      isActive
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($category: String!) {
    productsByCategory(category: $category) {
      _id
      name
      description
      price
      stock
      isActive
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($createProductDto: CreateProductDto!) {
    createProduct(createProductDto: $createProductDto) {
      _id
      name
      description
      price
      category
      stock
      isActive
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $updateProductDto: UpdateProductDto!) {
    updateProduct(id: $id, updateProductDto: $updateProductDto) {
      _id
      name
      description
      price
      category
      stock
      isActive
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation RemoveProduct($id: ID!) {
    removeProduct(id: $id) {
      _id
      isActive
    }
  }
`;
