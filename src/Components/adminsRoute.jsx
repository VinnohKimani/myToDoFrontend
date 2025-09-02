import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  // Check if logged in and is admin
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/tasks" />; // redirect non-admins to tasks page
  }

  return children;
};

export default AdminRoute;
