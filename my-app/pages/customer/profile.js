import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { gql, request } from "graphql-request";
import toast from "react-hot-toast";
import { useAuth } from "@/utils/AuthContext";
import { useRouter } from "next/router";

const GET_CUSTOMER_PROFILE = gql`
  query GetCustomerProfile {
    me {
      _id
      firstName
      lastName
      email
      phone
      address
      # Add other fields you want to display
    }
  }
`;

const UPDATE_CUSTOMER_PROFILE = gql`
  mutation UpdateCustomerProfile($updateCustomerDto: UpdateCustomerDto!) {
    updateProfile(updateCustomerDto: $updateCustomerDto) {
      _id
      firstName
      lastName
      email
      phone
      address
      # Add other fields you want to return
    }
  }
`;

export default function ProfilePage() {
  const [customer, setCustomer] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated, authLoading } = useAuth();
  let token = localStorage.getItem("token");
  console.log("token", token);

  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchProfile = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const data = await request(
        "http://localhost:3002/graphql",
        GET_CUSTOMER_PROFILE,
        {},
        headers
      );

      setCustomer(data.me);
      setFormData({
        firstName: data.me.firstName,
        lastName: data.me.lastName,
        email: data.me.email,
        phone: data.me.phone || "",
        address: data.me.address || "",
      });
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const variables = {
        updateCustomerDto: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },
      };

      const data = await request(
        "http://localhost:3002/graphql",
        UPDATE_CUSTOMER_PROFILE,
        variables,
        headers
      );

      setCustomer(data.updateProfile);
      toast.success("Profile updated successfully!");
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error("Failed to update profile");
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  if (authLoading || loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;
  if (!customer) return <div>No profile data found</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {/* <h2 className="text-xl font-semibold mb-4">
                Personal Information
              </h2> */}
              <div className="space-y-4">
                <div>
                  <p className="text-gray-500">First Name</p>
                  <p className="font-medium">{customer.firstName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Name</p>
                  <p className="font-medium">{customer.lastName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
                {customer.phone && (
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium">{customer.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {customer.address && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Address</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500">Address</p>
                    <p className="font-medium">{customer.address}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Profile</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
