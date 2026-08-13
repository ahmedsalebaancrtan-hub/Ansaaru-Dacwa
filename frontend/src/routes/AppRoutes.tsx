import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

// Auth Pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import CreateUserPage from "../pages/auth/CreateUserPage";

// Dashboard
import DashboardPage from "../pages/dashboard/DashboardPage";

// School Management
import ClassesPage from "../pages/dashboard/ClassesPage";
import FamiliesPage from "../pages/dashboard/FamiliesPage";
import StudentsPage from "../pages/dashboard/StudentsPage";
import EmployeesPage from "../pages/dashboard/EmployeesPage";
import SubjectsPage from "../pages/dashboard/SubjectsPage";

// Attendance
import AttendancePage from "../pages/dashboard/AttendancePage";

// Exams
import ExamsPage from "../pages/dashboard/ExamsPage";

// Finance
import StudentFeesPage from "../pages/dashboard/StudentFeesPage";
import SalariesPage from "../pages/dashboard/SalariesPage";

// Routes Protection
import AdminRoute from "./AdminRoute";

const router = createBrowserRouter([
  // Root
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // Auth
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },

  // Dashboard
  {
    path: "/dashboard",
    element: <DashboardLayout />,

    children: [
      // Dashboard Home
      {
        index: true,
        element: <DashboardPage />,
      },

      // Classes
      {
        path: "classes",
        element: <ClassesPage />,
      },

      // Families
      {
        path: "families",
        element: <FamiliesPage />,
      },

      // Students
      {
        path: "students",
        element: <StudentsPage />,
      },

      // Employees
      {
        path: "employees",
        element: <EmployeesPage />,
      },

      // Subjects
      {
        path: "subjects",
        element: <SubjectsPage />,
      },

      // Attendance
      {
        path: "attendance",
        element: <AttendancePage />,
      },

      // Exams
      {
        path: "exams",
        element: <ExamsPage />,
      },

      // Student Fees
      {
        path: "fees",
        element: <StudentFeesPage />,
      },

      // Salaries
      {
        path: "salaries",
        element: <SalariesPage />,
      },

      // Admin Only
      {
        element: <AdminRoute />,

        children: [
          {
            path: "users/create",
            element: <CreateUserPage />,
          },
        ],
      },
    ],
  },

  // Not Found
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export default router;