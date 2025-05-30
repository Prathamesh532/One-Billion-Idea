import React, { createContext, useContext, useState, useEffect } from "react";

const OrderStatusContext = createContext();

export const OrderStatusProvider = ({ children }) => {
  const [orderUpdates, setOrderUpdates] = useState({});

  const handleOrderUpdate = (update) => {
    setOrderUpdates((prev) => ({
      ...prev,
      [update.orderId]: update,
    }));
  };

  return (
    <OrderStatusContext.Provider value={{ orderUpdates }}>
      {children}
    </OrderStatusContext.Provider>
  );
};

export const useOrderStatus = () => useContext(OrderStatusContext);
