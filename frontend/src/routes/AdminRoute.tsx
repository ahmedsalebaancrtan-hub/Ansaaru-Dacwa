import {
  Navigate,
  Outlet,
} from "react-router";

import { useAuth } from "../hooks/auth/useAuth";

function AdminRoute() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user?.role !== "ADMIN") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }
  

  return <Outlet />;
}

export default AdminRoute;