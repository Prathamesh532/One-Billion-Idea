// import Link from "next/link";

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">
//           Inventory Management
//         </h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <Link
//             href="/products"
//             className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
//           >
//             <h2 className="text-xl font-semibold mb-2">Products</h2>
//             <p className="text-gray-600">Manage your product inventory</p>
//           </Link>

//           <Link
//             href="/orders"
//             className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
//           >
//             <h2 className="text-xl font-semibold mb-2">Orders</h2>
//             <p className="text-gray-600">View and manage customer orders</p>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// pages/index.js
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-700">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Store</h1>
      <p className="mb-8">Choose your role:</p>
      <div className="space-x-4">
        <Link href="/customer/login">
          <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
            Customer
          </button>
        </Link>
        <Link href="/admin/login">
          <button className="bg-green-700 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-800">
            Admin
          </button>
        </Link>
      </div>
    </div>
  );
}
