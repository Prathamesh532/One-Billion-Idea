import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useApolloClient } from "@apollo/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const client = useApolloClient();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    router.push("/profile");
  };

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
