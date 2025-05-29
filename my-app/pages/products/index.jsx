import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../../lib/queries";
import Link from "next/link";

export default function ProductList() {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/products/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.products.map((product) => (
          <div key={product._id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <div className="flex justify-between mb-2">
              <span className="font-medium">${product.price}</span>
              <span
                className={`px-2 py-1 rounded ${
                  product.stock > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                Stock: {product.stock}
              </span>
            </div>
            <div className="flex gap-2 mt-4">
              <Link
                href={`/products/edit/${product._id}`}
                className="flex-1 text-center bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </Link>
              <Link
                href={`/products/${product._id}`}
                className="flex-1 text-center bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
