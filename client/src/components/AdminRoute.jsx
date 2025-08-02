import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const AdminRoute = () => {
  const { user } = useAuth();

  if (user === undefined) {
    return <LoadingSpinner />;
  }

  return user?.isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
