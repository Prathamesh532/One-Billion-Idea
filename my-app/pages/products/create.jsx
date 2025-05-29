import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { CREATE_PRODUCT, GET_PRODUCTS } from "../../lib/queries";
import ProductForm from "../../components/ProductForm";

export default function CreateProduct() {
  const router = useRouter();
  const [createProduct, { loading }] = useMutation(CREATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
    onCompleted: () => router.push("/products"),
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Product</h1>
      <ProductForm
        onSubmit={(data) =>
          createProduct({ variables: { createProductDto: data } })
        }
        loading={loading}
      />
    </div>
  );
}
