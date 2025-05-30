import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useApolloClient } from "@apollo/client";
import { gql, GraphQLClient } from "graphql-request";
import toast from "react-hot-toast";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginCustomerDto: { email: $email, password: $password }) {
      access_token
      customer {
        _id
        firstName
        lastName
        email
      }
    }
  }
`;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const client = useApolloClient();

  const login = async (e, email, password) => {
    e.preventDefault();
    setLoading(true);

    try {
      const client = new GraphQLClient("http://localhost:3002/graphql");
      const data = await client.request(LOGIN, { email, password });

      localStorage.setItem("token", data.login.access_token);
      toast.success("Login successful!");
      setIsAuthenticated(true);
      router.push("/customer/products");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.errors[0]?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  // const login = (token) => {
  //   localStorage.setItem("token", token);
  //   setIsAuthenticated(true);
  //   router.push("/profile");
  // };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    client.resetStore();
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
