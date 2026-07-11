import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { authStorage } from "../utils/authStorage";
import type {
  AuthSession,
  AuthUser,
  BackendUser,
  LoginApiResponse,
  UserRole,
} from "../types/Auth/auth.types";

// Axios instance-ka guud ee dhammaan API requests-ka.
export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ??
    "http://localhost:9000",

  timeout: 15_000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const refreshClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ??
    "http://localhost:9000",

  timeout: 15_000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let refreshRequest: Promise<AuthSession> | null = null;

const AUTH_ENDPOINTS = [
  "/api/users/register",
  "/api/users/Login",
  "/api/users/forget-password",
  "/api/users/reset",
  "/api/users/Refresh_token",
];

interface RetryableRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

function isAuthEndpoint(url?: string): boolean {
  return AUTH_ENDPOINTS.some((endpoint) =>
    url?.includes(endpoint),
  );
}

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

async function refreshSession(): Promise<AuthSession> {
  const refreshToken = authStorage.getRefreshToken();

  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  const { data: response } =
    await refreshClient.post<LoginApiResponse>(
      "/api/users/Refresh_token",
      undefined,
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );

  if (
    !response.is_sucess ||
    !response.data?.User ||
    !response.data.Access_token ||
    !response.data.Refresh_token
  ) {
    throw new Error(
      response.messege || "Unable to refresh session",
    );
  }

  return {
    user: mapBackendUser(response.data.User),
    accessToken: response.data.Access_token,
    refreshToken: response.data.Refresh_token,
  };
}

function clearSessionAndRedirect(): void {
  authStorage.clearSession();

  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
}

// Token-ka ku dar requests-ka u baahan authentication.
api.interceptors.request.use((config) => {
  const accessToken = authStorage.getAccessToken();

  if (
    accessToken &&
    !config.headers.Authorization &&
    !isAuthEndpoint(config.url)
  ) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Marka token-ku invalid noqdo, session-ka nadiifi.
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      authStorage.getRefreshToken() &&
      !isAuthEndpoint(error.config?.url)
    ) {
      const originalRequest =
        error.config as RetryableRequestConfig | undefined;

      if (!originalRequest || originalRequest._retry) {
        clearSessionAndRedirect();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        refreshRequest ??= refreshSession().finally(() => {
          refreshRequest = null;
        });

        const session = await refreshRequest;
        authStorage.updateSession(session);

        originalRequest.headers.Authorization =
          `Bearer ${session.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        clearSessionAndRedirect();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
