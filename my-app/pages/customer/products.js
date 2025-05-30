// pages/customer/products.js
import { useEffect, useState, useContext } from "react";
import { request, gql } from "graphql-request";
import Navbar from "@/components/Navbar";
import { CartContext } from "@/lib/CartContext";
import toast from "react-hot-toast";

const PRODUCTS_QUERY = gql`
  {
    products {
      _id
      name
      price
      stock
      imageUrl
      isActive
    }
  }
`;

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    request("http://localhost:3001/graphql", PRODUCTS_QUERY).then((data) => {
      const activeProducts = data.products.filter(
        (product) => product.isActive
      );
      console.log("activeProducts", activeProducts);
      
      setProducts(activeProducts);
    });
  }, []);

  const handleQuantityChange = (id, value) => {
    setQuantities({ ...quantities, [id]: parseInt(value) });
  };

  return (
    <>
      <Navbar />
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => {
          const qty = quantities[product._id] || 1;

          return (
            <div
              key={product._id}
              className="border p-4 rounded shadow bg-white"
            >
              <img
                src={product.imageUrl || "/placeholder.png"}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
              <p className="font-bold mt-2">₹{product.price}</p>
              <div className="flex items-center justify-between mt-4">
                <input
                  type="number"
                  value={qty}
                  min={1}
                  max={product.stock}
                  onChange={(e) =>
                    handleQuantityChange(product._id, e.target.value)
                  }
                  className="w-16 border p-1"
                />
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => {
                    addToCart(product, qty);
                    toast.success("Added to cart");
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
