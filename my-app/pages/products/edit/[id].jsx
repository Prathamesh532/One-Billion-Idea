import { useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import {
  GET_PRODUCT,
  UPDATE_PRODUCT,
  GET_PRODUCTS,
} from "../../../lib/queries";
import ProductForm from "../../../components/ProductForm";

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;

  const { data, loading: queryLoading } = useQuery(GET_PRODUCT, {
    variables: { id },
  });
  const [updateProduct, { loading }] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
    onCompleted: () => router.push("/products"),
  });

  if (queryLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <ProductForm
        initialData={data?.product}
        onSubmit={(data) =>
          updateProduct({ variables: { id, updateProductDto: data } })
        }
        loading={loading}
      />
    </div>
  );
}
