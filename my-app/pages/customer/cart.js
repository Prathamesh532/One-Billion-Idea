import { useState, useContext } from "react";
import Navbar from "@/components/Navbar";
import { CartContext } from "@/lib/CartContext";
import toast from "react-hot-toast";
import { gql, request } from "graphql-request";

const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderDto!) {
    createOrder(createOrderDto: $input) {
      _id
      customerId
      totalAmount
      status
    }
  }
`;

export default function CartPage() {
  const { cartItems, removeFromCart, setCartItems } = useContext(CartContext);
  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      setError("Your cart is empty");
      toast.error("Cart is empty");
      return;
    }

    if (!shippingAddress.trim()) {
      setError("Please enter a shipping address");
      toast.error("Shipping address is required");
      return;
    }

    setLoading(true);
    setError(null);

    const items = cartItems.map(({ _id, quantity = 1 }) => ({
      productId: _id,
      quantity: quantity,
    }));

    const input = {
      customerId: "customer123", // Replace with actual auth-based ID
      items,
      shippingAddress: shippingAddress.trim(),
    };

    try {
      const data = await request(
        "http://localhost:3001/graphql",
        CREATE_ORDER,
        { input }
      );

      localStorage.removeItem("cart");
      setCartItems([]);
      toast.success(`Order placed! ID: ${data.createOrder._id}`);
    } catch (error) {
      console.error("Order failed:", error);
      const msg =
        error.response?.errors?.[0]?.message || "Failed to place order";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center mb-4 p-4 border rounded bg-white"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => {
                    removeFromCart(item._id);
                    toast.success("Item removed");
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="mt-6">
              <label className="block font-medium mb-2">Shipping Address</label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows="3"
                className="w-full border p-2 rounded"
                placeholder="Enter shipping address"
              />
            </div>

            {error && <p className="text-red-600 mt-2">{error}</p>}

            <div className="mt-4 text-right font-semibold text-lg">
              Total: ₹{total}
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
