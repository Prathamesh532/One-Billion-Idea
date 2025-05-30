import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import jwtDecode from "jwt-decode";
import { useAuth } from "@/utils/AuthContext";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(e, email, password);
      toast.success("Login successful!");
      router.push("/customer/products");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.errors[0]?.message || "Login failed!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token != undefined) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        let valid = decoded.exp && decoded.exp > currentTime;

        if (valid) {
          router.push("/customer/products");
        }
      } catch (error) {
        console.error("Token decoding failed:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-700">
      <div className="bg-white text-black p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Customer Login
        </h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input mt-2"
            required
          />
          <button type="submit" className="btn mt-4" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
          <Link href="/customer/register" className="text-blue-600 underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
