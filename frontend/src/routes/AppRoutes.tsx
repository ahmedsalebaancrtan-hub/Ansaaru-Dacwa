import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import { useAuth } from "../hooks/auth/useAuth";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

import DashboardPage from "../pages/dashboard/DashboardPage";


import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import CreateUserPage from "../pages/auth/CreateUserPage";

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Redirect the root route based on authentication status */}
      <Route
        path="/"
        element={
          <Navigate
            to={isAuthenticated ? "/dashboard" : "/login"}
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
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate
              to="/dashboard"
              replace
            />
          ) : (
            <RegisterPage />
          )
        }
      />

      <Route
        path="/forgot-password"
        element={
          isAuthenticated ? (
            <Navigate
              to="/dashboard"
              replace
            />
          ) : (
            <ForgotPasswordPage />
          )
        }
      />

      <Route
        path="/reset-password"
        element={
          isAuthenticated ? (
            <Navigate
              to="/dashboard"
              replace
            />
          ) : (
            <ResetPasswordPage />
          )
        }
      />

      {/* Routes that require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        {/* Routes that require an ADMIN role */}
        <Route element={<AdminRoute />}>
          <Route
            path="/dashboard/users/create"
            element={<CreateUserPage />}
          />
        </Route>
      </Route>

      {/* Redirect unknown routes */}
      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? "/dashboard" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}

export default AppRoutes;