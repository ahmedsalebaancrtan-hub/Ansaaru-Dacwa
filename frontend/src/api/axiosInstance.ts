import axios from "axios";

import { authStorage } from "../utils/authStorage";

// Axios instance-ka guud ee dhammaan API requests-ka.
export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ??
    "http://localhost:8080",

  timeout: 15_000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Token-ka ku dar requests-ka u baahan authentication.
api.interceptors.request.use((config) => {
  const accessToken = authStorage.getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Marka token-ku invalid noqdo, session-ka nadiifi.
api.interceptors.response.use(
  (response) => response,

  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      authStorage.getAccessToken()
    ) {
      authStorage.clearSession();

      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  },
);