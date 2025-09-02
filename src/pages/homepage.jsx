import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold">MyTodo</h1>
          <div className="space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 border border-white rounded hover:bg-white hover:text-blue-600 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 border border-white rounded hover:bg-white hover:text-blue-600 transition"
            >
              Signup
            </Link>
          </div>
        </div>
      </header>

      {/* Hero / Center Section */}
      <main className="flex-grow bg-amber-200 text-blue-800 flex flex-col justify-center items-center text-center px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
          Organize Your Life, One Task at a Time
        </h2>
        <p className="text-lg md:text-xl text-blue-600 max-w-xl">
          MyTodo helps you focus, stay productive, and achieve your goals. Start
          managing your tasks efficiently today!
        </p>
        <Link
          to="/signup"
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-4 text-center">
        &copy; {new Date().getFullYear()} MyTodo. All rights reserved.
      </footer>
    </div>
  );
}
