import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { gql, request } from "graphql-request";
import toast from "react-hot-toast";

const GET_ORDERS = gql`
  query OrdersByCustomer($customerId: String!) {
    ordersByCustomer(customerId: $customerId) {
      _id
      totalAmount
      status
      shippingAddress
      createdAt
      items {
        productId
        productName
        quantity
        price
      }
    }
  }
`;

const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
    updateOrderStatus(id: $id, status: $status) {
      _id
      status
    }
  }
`;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const customerId = "customer123"; // Replace with real user ID from auth

  const fetchOrders = async () => {
    try {
      const data = await request("http://localhost:3001/graphql", GET_ORDERS, {
        customerId,
      });
      setOrders(data.ordersByCustomer);
    } catch (err) {
      toast.error("Failed to load orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmed) return;

    setCancellingOrder(orderId);
    try {
      await request("http://localhost:3001/graphql", UPDATE_ORDER_STATUS, {
        id: orderId,
        status: "CANCELLED",
      });
      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch (err) {
      const errorMessage =
        err.response?.errors?.[0]?.message || "Failed to cancel order";
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setCancellingOrder(null);
    }
  };

  // Merge real-time updates with query data
  const filteredOrders =
    filterStatus === "ALL"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>

        {/* Filter Dropdown */}
        <div className="mb-6">
          <label className="mr-2 font-medium">Filter by status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 px-3 py-1 rounded-md"
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="border rounded-md p-4 bg-white shadow"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">Order #{order._id}</h3>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      order.status === "PENDING"
                        ? "bg-yellow-200 text-yellow-700"
                        : order.status === "COMPLETED"
                        ? "bg-green-200 text-green-700"
                        : order.status === "CANCELLED"
                        ? "bg-red-200 text-red-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                  {order.status === "PENDING" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancellingOrder === order._id}
                      className={`text-sm px-3 py-1 rounded-full ${
                        cancellingOrder === order._id
                          ? "bg-gray-200 text-gray-500"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      } transition`}
                    >
                      {cancellingOrder === order._id
                        ? "Cancelling..."
                        : "Cancel"}
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  Placed on:{" "}
                  {new Intl.DateTimeFormat("en-GB").format(
                    new Date(order.createdAt)
                  )}
                </p>
                <p className="text-sm mb-3">
                  Shipping Address:{" "}
                  <span className="font-medium">{order.shippingAddress}</span>
                </p>
                <div className="border-t pt-3">
                  <h4 className="font-semibold mb-2">Items</h4>
                  <ul className="space-y-1">
                    {order.items.map((item, index) => (
                      <li
                        key={index}
                        className="flex justify-between text-sm text-gray-800"
                      >
                        <span>{item.productName}</span>
                        <span>
                          ₹{item.price} × {item.quantity} = ₹
                          {item.price * item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-right font-semibold mt-4 text-blue-700">
                  Total: ₹{order.totalAmount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
