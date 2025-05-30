import Link from "next/link";
import { useRouter } from "next/router";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const active = (path) =>
    router.pathname === path ? "bg-blue-100 text-blue-800" : "";

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <Link
            href="/admin/products"
            className={`block px-4 py-2 rounded ${active("/admin/products")}`}
          >
            Products
          </Link>
          <Link
            href="/admin/orders"
            className={`block px-4 py-2 rounded ${active("/admin/orders")}`}
          >
            Orders
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
