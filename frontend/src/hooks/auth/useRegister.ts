import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { registerUser } from "../../api/Auth/auth.api";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

export function useRegister() {
  return useMutation({
    mutationFn: registerUser,

    onSuccess: (result) => {
      toast.success(result.message);
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to create account",
        ),
      );
    },
  });
}