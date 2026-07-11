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
  RegisterRequest,
  ResetPasswordRequest,
  UserProfile,
  UserProfileApiResponse,
  UserRole,
} from "../../types/Auth/auth.types";

// Endpoints-ka authentication-ka.
const AUTH_ENDPOINTS = {
  register: "/api/users/register",
  login: "/api/users/Login",
  forgotPassword: "/api/users/forget-password",
  resetPassword: "/api/users/reset",
  whoAmI: "/api/users/whoami",
  refreshToken: "/api/users/Refresh_token",
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
    response.error ??
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
    await api.post<LoginApiResponse>(
      AUTH_ENDPOINTS.register,
      request,
    );

  if (
    !response.is_sucess ||
    !response.data?.User ||
    !response.data.Access_token ||
    !response.data.Refresh_token
  ) {
    throw new Error(
      response.messege || "Unable to create user",
    );
  }

  return {
    message:
      response.messege || "User created successfully",
  };
}


/**
 * Creates a new user account.
 * Replace the endpoint if the backend uses another register route.
 */
export async function registerUser(
  request: RegisterRequest,
): Promise<LoginResult> {
  const { data: response } =
    await api.post<LoginApiResponse>(
      AUTH_ENDPOINTS.register,
      request,
    );

  if (
    !response.is_sucess ||
    !response.data?.User ||
    !response.data.Access_token ||
    !response.data.Refresh_token
  ) {
    throw new Error(
      response.messege || "Unable to create account",
    );
  }

  return {
    message:
      response.messege ??
      "Account created successfully",

    session: {
      user: mapBackendUser(response.data.User),
      accessToken: response.data.Access_token,
      refreshToken: response.data.Refresh_token,
    },
  };
}

export async function getCurrentUser(): Promise<UserProfile> {
  const { data: response } =
    await api.get<UserProfileApiResponse>(
      AUTH_ENDPOINTS.whoAmI,
    );

  if (!response.is_success || !response.data) {
    throw new Error(
      response.message || "Unable to fetch current user",
    );
  }

  return {
    fullName: response.data.fullname,
    emailAddress: response.data.emailaddress,
    role: normalizeRole(response.data.role),
    createdAt: response.data.created_at,
    updatedAt: response.data.updated_at,
  };
}
