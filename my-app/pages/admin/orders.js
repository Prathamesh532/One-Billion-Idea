import { useState, useEffect } from "react";
import { request, gql } from "graphql-request";
import AdminLayout from "@/components/AdminLayout";

const GRAPHQL_ENDPOINT = "http://localhost:3001/graphql";

const GET_ORDERS = gql`
  query GetOrders {
    orders {
      _id
      customerId
      totalAmount
      status
      createdAt
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

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await request(GRAPHQL_ENDPOINT, GET_ORDERS);
      setOrders(data.orders);
    } catch (error) {
      alert("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      const data = await request(
        "http://localhost:3001/graphql",
        UPDATE_ORDER_STATUS,
        {
          id: orderId,
          status: status.toUpperCase(), // Convert to enum format
        }
      );
      alert("Order status updated successfully");
      // refetch data here if needed
      fetchOrders();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleCancel = () => setIsModalVisible(false);

  return (
    <AdminLayout>
      <div className="p-4 overflow-x-auto">
        <table className="min-w-full table-auto bg-white border border-gray-200 rounded-md shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
              <th className="border px-4 py-3">Order ID</th>
              <th className="border px-4 py-3">Customer ID</th>
              <th className="border px-4 py-3">Total Amount</th>
              <th className="border px-4 py-3">Status</th>
              <th className="border px-4 py-3">Date</th>
              <th className="border px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="text-center hover:bg-gray-50 transition-all text-sm"
              >
                <td className="border px-4 py-2">{order._id.slice(0, 8)}...</td>
                <td className="border px-4 py-2">{order.customerId}</td>
                <td className="border px-4 py-2 font-medium text-green-600">
                  ${order.totalAmount.toFixed(2)}
                </td>
                <td className="border px-4 py-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold ${
                      order.status === "PENDING"
                        ? "bg-orange-500"
                        : order.status === "SHIPPED"
                        ? "bg-blue-500"
                        : order.status === "DELIVERED"
                        ? "bg-green-500"
                        : order.status === "PROCESSING"
                        ? "bg-yellow-500"
                        : order.status === "CONFIRMED"
                        ? "bg-purple-500"
                        : "bg-red-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="border px-4 py-2 text-gray-600">
                  {new Intl.DateTimeFormat("en-GB").format(
                    new Date(order.createdAt)
                  )}
                </td>
                <td className="border px-4 py-2">
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => showOrderDetails(order)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Details
                    </button>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="border rounded px-3 py-1 text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        {isModalVisible && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Order Details</h2>
                <button
                  onClick={handleCancel}
                  className="text-red-500 hover:underline"
                >
                  Close
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Order ID:</strong> {selectedOrder._id}
                </div>
                <div>
                  <strong>Customer ID:</strong> {selectedOrder.customerId}
                </div>
                <div className="flex items-center">
                  <strong>Status:</strong>
                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-white text-xs font-medium ${
                      selectedOrder.status === "Pending"
                        ? "bg-orange-500"
                        : selectedOrder.status === "Shipped"
                        ? "bg-blue-500"
                        : selectedOrder.status === "Delivered"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <strong>Total Amount:</strong> $
                  {selectedOrder.totalAmount.toFixed(2)}
                </div>
                <div>
                  <strong>Date:</strong>{" "}
                  {new Intl.DateTimeFormat("en-GB").format(
                    new Date(selectedOrder.createdAt)
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
