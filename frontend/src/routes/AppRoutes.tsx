// import {
//   createBrowserRouter,
//   Navigate,
// } from "react-router-dom";

// import DashboardLayout from "../components/layout/DashboardLayout";

// import LoginPage from "../pages/auth/LoginPage";
// import RegisterPage from "../pages/auth/RegisterPage";
// import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
// import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
// import CreateUserPage from "../pages/auth/CreateUserPage";

// import DashboardPage from "../pages/dashboard/DashboardPage";


// import ProtectedRoute from "./ProtectedRoute";
// import AdminRoute from "./AdminRoute";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Navigate to="/login" replace />,
//   },

//   {
//     path: "/login",
//     element: <LoginPage />,
//   },
//   {
//     path: "/register",
//     element: <RegisterPage />,
//   },
//   {
//     path: "/forgot-password",
//     element: <ForgotPasswordPage />,
//   },
//   {
//     path: "/reset-password",
//     element: <ResetPasswordPage />,
//   },

//   {
//     element: <ProtectedRoute />,
//     children: [
//       {
//         path: "/dashboard",
//         element: <DashboardLayout />,
//         children: [
//           {
//             index: true,
//             element: <DashboardPage />,
//           },
//           {
//             element: <AdminRoute />,
//             children: [
//               {
//                 path: "users/create",
//                 element: <CreateUserPage />,
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },

//   {
//     path: "*",
//     element: <Navigate to="/login" replace />,
//   },
// ]);

// export default router;


import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import CreateUserPage from "../pages/auth/CreateUserPage";

import DashboardPage from "../pages/dashboard/DashboardPage";

import AdminRoute from "./AdminRoute";
import ClassesPage from "../pages/dashboard/ClassesPage";
import FamiliesPage from "../pages/dashboard/FamiliesPage";
import StudentsPage from "../pages/dashboard/StudentsPage";
import StudentClassesPage from "../pages/dashboard/StudentClassesPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

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

  {
    path: "/dashboard",
    element: <DashboardLayout />,

    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
  path: "classes",
  element: <ClassesPage />,
},
{
  path: "families",
  element: <FamiliesPage />,
},
{
  path: "students",
  element: <StudentsPage />,
},
{
  path: "student-classes",
  element: <StudentClassesPage />,
},

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

  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export default router;