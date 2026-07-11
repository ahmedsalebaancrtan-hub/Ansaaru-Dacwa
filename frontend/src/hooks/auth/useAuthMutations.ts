import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  createUser,
  forgotPassword,
  resetPassword,
} from "../../api/Auth/auth.api";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,

    onSuccess: (result) => {
      toast.success(result.message);
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to send OTP",
        ),
      );
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,

    onSuccess: (result) => {
      toast.success(result.message);
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to reset password",
        ),
      );
    },
  });
}

export function useCreateUser() {
  return useMutation({
    mutationFn: createUser,

    onSuccess: (result) => {
      toast.success(result.message);
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to create user",
        ),
      );
    },
  });
}
