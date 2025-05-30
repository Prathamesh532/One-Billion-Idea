import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// useOrderWebSocket.js
export const useOrderWebSocket = (orderId) => {
  const [status, setStatus] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      path: "/socket.io",
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket");
      newSocket.emit("subscribe_order", { orderId });
    });

    newSocket.on("order_update", (data) => {
      console.log("Order updated:", data);
      if (data.orderId === orderId) {
        setStatus(data.status);
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [orderId]);

  return { status };
};
