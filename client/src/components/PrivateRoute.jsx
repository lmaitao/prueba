import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const PrivateRoute = ({ adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
