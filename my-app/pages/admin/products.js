import AdminLayout from "@/components/AdminLayout";
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "react-hot-toast";
import {
  GET_PRODUCTS,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
} from "../../lib/graphql/products";

export default function Products() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: "",
    isActive: true,
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: "",
    isActive: "",
  });

  const { loading, data, error: queryError, refetch } = useQuery(GET_PRODUCTS);
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  const validateForm = () => {
    const newErrors = {
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
    };
    let isValid = true;

    if (!formValues.name.trim()) {
      newErrors.name = "Product name is required";
      isValid = false;
    }

    if (!formValues.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (!formValues.price) {
      newErrors.price = "Price is required";
      isValid = false;
    } else if (
      isNaN(parseFloat(formValues.price)) ||
      parseFloat(formValues.price) <= 0
    ) {
      newErrors.price = "Please enter a valid positive number";
      isValid = false;
    }

    if (!formValues.category) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    if (!formValues.stock) {
      newErrors.stock = "Stock quantity is required";
      isValid = false;
    } else if (isNaN(parseInt(formValues.stock))) {
      newErrors.stock = "Please enter a valid number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    const toastId = toast.loading(
      editingProduct ? "Updating product..." : "Creating product..."
    );

    try {
      const variables = editingProduct
        ? {
            id: editingProduct._id,
            updateProductDto: {
              ...formValues,
              price: parseFloat(formValues.price),
              stock: parseInt(formValues.stock),
            },
          }
        : {
            createProductDto: {
              ...formValues,
              price: parseFloat(formValues.price),
              stock: parseInt(formValues.stock),
            },
          };

      await (editingProduct ? updateProduct : createProduct)({ variables });

      toast.dismiss(toastId);
      toast.success(
        editingProduct
          ? "Product updated successfully"
          : "Product created successfully"
      );

      refetch();
      setIsModalVisible(false);
      setEditingProduct(null);
      setFormValues({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        imageUrl: "",
        isActive: true,
      });
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Product operation error:", error);

      if (error.networkError) {
        toast.error("Network error. Please check your connection.");
      } else if (error.graphQLErrors) {
        error.graphQLErrors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error(
          editingProduct
            ? "Failed to update product"
            : "Failed to create product"
        );
      }
    }
  };

  const handleDelete = async (id) => {
    const toastId = toast.loading("Deleting product...");

    try {
      await deleteProduct({ variables: { id } });
      await refetch();
      toast.dismiss(toastId);
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Delete error:", error);
      toast.error("Failed to delete product");
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormValues({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      imageUrl: product.imageUrl,
      isActive: product.isActive,
    });
    setIsModalVisible(true);
  };

  if (queryError) {
    return (
      <AdminLayout>
        <div className="p-6 text-red-500">
          Error loading products: {queryError.message}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Product Management
          </h2>
          <button
            onClick={() => {
              setIsModalVisible(true);
              setEditingProduct(null);
              setFormValues({
                name: "",
                description: "",
                price: "",
                category: "",
                stock: "",
                imageUrl: "",
                isActive: true,
              });
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add New Product
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Name",
                    "Description",
                    "Price",
                    "Category",
                    "Stock",
                    "Status",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : data?.products?.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No products found
                    </td>
                  </tr>
                ) : (
                  data?.products?.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                        {product.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.stock > 10
                              ? "bg-green-100 text-green-800"
                              : product.stock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openEditModal(product)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
                              )
                            ) {
                              handleDelete(product._id);
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Background Overlay */}
            <div
              className="absolute inset-0 bg-black opacity-50 z-40"
              onClick={() => setIsModalVisible(false)}
            ></div>

            <div className="relative z-50 bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
              <div className="">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h3>

                  <div className="space-y-4">
                    {[
                      { label: "Product Name", name: "name", type: "text" },
                      {
                        label: "Description",
                        name: "description",
                        type: "textarea",
                      },
                      { label: "Image URL", name: "imageUrl", type: "text" },
                      { label: "Price ($)", name: "price", type: "number" },
                      {
                        label: "Stock Quantity",
                        name: "stock",
                        type: "number",
                      },
                    ].map(({ label, name, type }) => (
                      <div key={name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {label}
                        </label>
                        {type === "textarea" ? (
                          <textarea
                            name={name}
                            value={formValues[name]}
                            onChange={handleChange}
                            className={`w-full border rounded-md px-3 py-2 ${
                              errors[name]
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            rows={3}
                          />
                        ) : (
                          <input
                            type={type}
                            name={name}
                            value={formValues[name]}
                            onChange={handleChange}
                            className={`w-full border rounded-md px-3 py-2 ${
                              errors[name]
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            min={type === "number" ? "0" : undefined}
                            step={name === "price" ? "0.01" : undefined}
                          />
                        )}
                        {errors[name] && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors[name]}
                          </p>
                        )}
                      </div>
                    ))}

                    <div className="mb-4 flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Status (Active)
                      </label>
                      <div className="mt-1">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={formValues.isActive}
                          onChange={(e) =>
                            setFormValues((prev) => ({
                              ...prev,
                              isActive: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          {formValues.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formValues.category}
                        onChange={handleChange}
                        className={`w-full border rounded-md px-3 py-2 ${
                          errors.category ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select a category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Food">Food</option>
                        <option value="Books">Books</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.category}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingProduct ? "Update Product" : "Create Product"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalVisible(false);
                      setEditingProduct(null);
                      setErrors({
                        name: "",
                        description: "",
                        price: "",
                        category: "",
                        stock: "",
                        imageUrl: "",
                        isActive: "",
                      });
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
