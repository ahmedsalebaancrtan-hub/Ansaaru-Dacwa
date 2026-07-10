import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import { useAuth } from "../hooks/auth/useAuth";

import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import LoginPage from "../pages/auth/LoginPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import DashboardPage from "../pages/dashboard/DashboardPage";


import AdminRoute from "./AdminRoute";
import ProtectedRoute from "./ProtectedRoute";
import CreateUserPage from "../pages/auth/CreateUserPage";

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={
              isAuthenticated
                ? "/dashboard"
                : "/login"
            }
            replace
          />
        }
      />

      {/* Public authentication routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate
              to="/dashboard"
              replace
            />
          ) : (
            <LoginPage />
          )
        }
      />

      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />

      <Route
        path="/reset-password"
        element={<ResetPasswordPage />}
      />

      {/* Authenticated routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        {/* Admin-only routes */}
        <Route element={<AdminRoute />}>
          <Route
            path="/dashboard/users/create"
            element={<CreateUserPage />}
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to={
              isAuthenticated
                ? "/dashboard"
                : "/login"
            }
            replace
          />
        }
      />
    </Routes>
  );
}

export default AppRoutes;