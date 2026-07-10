import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import { loginUser } from "../../api/Auth/auth.api";


import type {
  LoginRequest,
  LoginResult,
} from "../../types/Auth/auth.types";
import { useAuth } from "./useAuth";

interface LoginMutationVariables {
  credentials: LoginRequest;
  remember: boolean;
}

interface LoginMutationResult {
  result: LoginResult;
  remember: boolean;
}

interface ApiErrorResponse {
  message?: string;
  messege?: string;
  error?: string;
}

function getLoginErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.messege ??
      error.response?.data?.error ??
      "Email or password is incorrect"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while logging in";
}

export function useLogin() {
  const navigate = useNavigate();
  const { saveSession } = useAuth();

  return useMutation<
    LoginMutationResult,
    unknown,
    LoginMutationVariables
  >({
    mutationFn: async ({
      credentials,
      remember,
    }) => {
      const result = await loginUser(credentials);

      return {
        result,
        remember,
      };
    },

    onSuccess: ({ result, remember }) => {
      saveSession(result.session, remember);

      toast.success(
        result.message || "Login successful",
      );

      navigate("/dashboard", {
        replace: true,
      });
    },

    onError: (error) => {
      toast.error(getLoginErrorMessage(error));
    },
  });
}