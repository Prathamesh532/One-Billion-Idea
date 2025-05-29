import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { GET_PRODUCT } from "../../lib/queries";
import Link from "next/link";

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, error } = useQuery(GET_PRODUCT, { variables: { id } });

  if (loading) return <div className="p-4">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;

  const product = data.product;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <span
            className={`px-2 py-1 rounded ${
              product.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">{product.description}</p>
            <div className="mt-4">
              <p className="text-lg font-semibold">${product.price}</p>
              <p
                className={`text-sm ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock} in stock
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <label className="font-medium">Category:</label>
              <p className="text-gray-600">{product.category}</p>
            </div>
            {product.imageUrl && (
              <div>
                <label className="font-medium">Image:</label>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="mt-2 max-h-40 rounded"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Link
            href={`/products/edit/${product._id}`}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Edit Product
          </Link>
          <Link
            href="/products"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
}
