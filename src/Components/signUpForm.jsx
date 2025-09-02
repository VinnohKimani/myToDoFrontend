import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

// My validation schema
const schema = z
  .object({
    first_name: z.string().min(2, "First name must be at least 2 characters"),
    last_name: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone_number: z
      .string()
      .regex(/^\d{10}$/, "Phone number must be 9 digits (e.g. 712345678)"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[@$!%*?&#]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignUpForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const formatPhone = (phone_number) => {
    if (phone_number.startsWith("0")) {
      return `254${phone_number.slice(1)}`;
    } else if (phone_number.startsWith("+254")) {
      return phone_number.slice(1); // removes "+"
    } else if (!phone_number.startsWith("254")) {
      toast.error(
        "Please enter a valid phone number (starting with 07, 254, or +254)"
      );
      return null;
    }
    return phone_number;
  };

  // Post
  const onSubmit = async (formData) => {
    const formattedPhone = formatPhone(formData.phone_number);
    if (!formattedPhone) return; //stop if invalid phone

    try {
      const res = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone_number: formattedPhone,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Save token & user to localStorage
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Signup successful");

      // optional redirect
      navigate("/tasks");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br bg-amber-200 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-black mb-6">
          Create an Account
        </h1>
        <p className=" text-blue-600 text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-800 hover:underline">
            Login
          </a>
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First + Last Name */}
          <div>
            <div>
              <label className="block text-sm font-medium text-blue-700">
                First Name
              </label>
              <input
                type="text"
                {...register("first_name")}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 "
                placeholder="first name"
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm  font-medium text-blue-700">
                Last Name
              </label>
              <input
                type="text"
                {...register("last_name")}
                className="mt-1 w-full px-3 py-2 border rounded-lg "
                placeholder="last name"
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-blue-700">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
              placeholder="email@gmail.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-blue-700">
              Phone Number
            </label>
            <input
              type="text"
              {...register("phone_number")}
              className="mt-1 w-full px-3 py-2 border rounded-lg "
              placeholder="0712345678"
            />
            {errors.phone_number && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone_number.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-blue-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="mt-1 w-full px-3 py-2 border rounded-lg "
                placeholder="********"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-blue-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-blue-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="********"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-blue-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md font-medium transition disabled:opacity-50"
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
