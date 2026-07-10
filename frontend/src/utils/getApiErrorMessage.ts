import axios from "axios";

interface ApiErrorResponse {
  message?: string;
  messege?: string;
  error?: string;
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.messege ??
      error.response?.data?.error ??
      fallbackMessage
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}