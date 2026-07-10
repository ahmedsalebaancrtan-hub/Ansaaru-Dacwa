import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router";
import { useAuth } from "../hooks/auth/useAuth";


function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;