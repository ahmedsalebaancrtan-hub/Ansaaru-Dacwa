import { api } from "../axiosInstance";

import type {
  AuthUser,
  BackendUser,
  CreateUserRequest,
  ForgotPasswordRequest,
  LoginApiResponse,
  LoginRequest,
  LoginResult,
  MessageApiResponse,
  MessageResult,
  ResetPasswordRequest,
  UserRole,
} from "../../types/Auth/auth.types";

// Endpoints-ka authentication-ka.
const AUTH_ENDPOINTS = {
  login: "/api/v1/auth/login",
  forgotPassword: "/api/v1/auth/forgot-password",
  resetPassword: "/api/v1/auth/reset-password",
  createUser: "/api/v1/users",
};

function normalizeRole(role: string): UserRole {
  if (role === "ADMIN") {
    return "ADMIN";
  }

  if (
    role === "STUDENT_AFFAIRS" ||
    role === "StudentAffairs"
  ) {
    return "STUDENT_AFFAIRS";
  }

  if (role === "CASHIER" || role === "Cashier") {
    return "CASHIER";
  }

  throw new Error(`Unsupported user role: ${role}`);
}

// Backend user-ka u beddel format-ka frontend-ku isticmaalo.
function mapBackendUser(user: BackendUser): AuthUser {
  return {
    id: user.id,
    fullName: user.fullname,
    emailAddress: user.emailaddress,
    role: normalizeRole(user.role),
    createdAt: user.Createdat,
    updatedAt: user.Updatedat,
  };
}

function getResponseMessage(
  response: MessageApiResponse,
  fallbackMessage: string,
): string {
  return (
    response.message ??
    response.messege ??
    fallbackMessage
  );
}

export async function loginUser(
  credentials: LoginRequest,
): Promise<LoginResult> {
  const { data: response } =
    await api.post<LoginApiResponse>(
      AUTH_ENDPOINTS.login,
      credentials,
    );

  if (
    !response.is_sucess ||
    !response.data?.User ||
    !response.data.Access_token ||
    !response.data.Refresh_token
  ) {
    throw new Error(
      response.messege || "Unable to login",
    );
  }

  return {
    message:
      response.messege || "Login successful",

    session: {
      user: mapBackendUser(response.data.User),
      accessToken: response.data.Access_token,
      refreshToken: response.data.Refresh_token,
    },
  };
}

export async function forgotPassword(
  request: ForgotPasswordRequest,
): Promise<MessageResult> {
  const { data: response } =
    await api.post<MessageApiResponse>(
      AUTH_ENDPOINTS.forgotPassword,
      request,
    );

  return {
    message: getResponseMessage(
      response,
      "OTP has been sent to your email",
    ),
  };
}

export async function resetPassword(
  request: ResetPasswordRequest,
): Promise<MessageResult> {
  const { data: response } =
    await api.post<MessageApiResponse>(
      AUTH_ENDPOINTS.resetPassword,
      request,
    );

  return {
    message: getResponseMessage(
      response,
      "Password updated successfully",
    ),
  };
}

export async function createUser(
  request: CreateUserRequest,
): Promise<MessageResult> {
  const { data: response } =
    await api.post<MessageApiResponse>(
      AUTH_ENDPOINTS.createUser,
      request,
    );

  if (response.is_sucess === false) {
    throw new Error(
      getResponseMessage(
        response,
        "Unable to create user",
      ),
    );
  }

  return {
    message: getResponseMessage(
      response,
      "User created successfully",
    ),
  };
}