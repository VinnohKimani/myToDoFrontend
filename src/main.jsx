import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUpPage from "./pages/signUp";
import LoginPage from "./pages/LoginPage";
import { TasksPage } from "./pages/TasksPage";
import { AuthProvider } from "../src/Components/context/AuthContext";
import PrivateRoute from "./Components/PrivateRoute";
import HomePage from "./pages/homepage";
import AdminPage from "../src/pages/adminspage";
import AdminRoute from "./Components/adminsRoute";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/signUp",
    element: <SignUpPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/tasks",
    element: (
      <PrivateRoute>
        <TasksPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminPage />
      </AdminRoute>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ToastContainer position="top-right" />
      <RouterProvider router={routes} />
    </AuthProvider>
  </StrictMode>
);
