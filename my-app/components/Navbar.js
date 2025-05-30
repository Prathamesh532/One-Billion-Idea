import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/lib/CartContext";
import { useAuth } from "@/utils/AuthContext";

export default function Navbar() {
  const { cartItems } = useContext(CartContext);
  const { isAuthenticated, logout } = useAuth();

  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    setIsLogin(isAuthenticated);
  }, [isAuthenticated]);

  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <Link href="/customer/products" className="text-xl font-bold">
        MyStore
      </Link>
      <div className="flex gap-6 items-center">
        <Link href="/customer/cart" className="relative">
          🛒 Cart
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {cartItems.length}
            </span>
          )}
        </Link>
        <Link href="/customer/orders">📦 My Orders</Link>
        <div className="flex items-center space-x-4">
          {isLogin ? (
            <>
              <Link
                href="/customer/profile"
                className="text-gray-700 hover:text-gray-900"
              >
                👤 Profile
              </Link>
              <button
                onClick={logout}
                className="text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-gray-900">
                Login
              </Link>
              <Link
                href="/register"
                className="text-gray-700 hover:text-gray-900"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
