import { ApolloProvider } from "@apollo/client";
import { client } from "../lib/apollo-client";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/lib/CartContext";
import { AuthProvider } from "@/utils/AuthContext";
import { OrderStatusProvider } from "@/contexts/OrderStatusContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <CartProvider>
          <OrderStatusProvider>
            <Component {...pageProps} />
            <Toaster />
          </OrderStatusProvider>
        </CartProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
