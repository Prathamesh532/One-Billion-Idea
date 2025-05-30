import AdminLayout from "@/components/AdminLayout";

export default function Customers() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-4">Customer List</h1>
      {/* Replace with real data */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-2">1</td>
            <td className="p-2">user@example.com</td>
            <td className="p-2">Active</td>
          </tr>
        </tbody>
      </table>
    </AdminLayout>
  );
}
