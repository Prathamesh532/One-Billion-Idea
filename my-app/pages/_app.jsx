import { ApolloProvider } from "@apollo/client";
import { client } from "../lib/apollo-client";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/lib/CartContext";
import { AuthProvider } from "@/utils/AuthContext";

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <CartProvider>
          <Component {...pageProps} />
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
