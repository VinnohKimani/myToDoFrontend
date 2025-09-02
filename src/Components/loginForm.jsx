import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "./context/AuthContext";
import { BASE_URL } from "../utils";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Logged in successfully!");
        await login(data.user, data.access_token); // ✅ Use the correct login function
        if (data.user.role === "admin") {
          navigate("/admin");
        } else navigate("/tasks"); // ✅ Redirect only after context is updated
      } else {
        setError({ message: data.message || "Login failed" });
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };
  return (
    <div>
      {" "}
      <div className="min-h-screen bg-amber-200 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-blue-800 mb-1">
            Welcome Back to MyToDo
          </h1>
          <h2 className="text-xl font-semibold text-center text-blue-600 mb-4">
            Log In
          </h2>
          <p className="text-center text-sm text-blue-500 mb-6">
            Don’t have an account?{" "}
            <a
              className="text-blue-700 hover:underline font-medium"
              href="/signup"
            >
              Sign Up
            </a>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-600 text-sm text-center mb-2">
                {error.message}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md "
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md "
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 rounded-3xl transition shadow"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
