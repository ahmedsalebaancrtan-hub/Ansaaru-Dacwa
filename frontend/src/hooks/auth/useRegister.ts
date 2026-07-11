import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { registerUser } from "../../api/Auth/auth.api";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { useAuth } from "./useAuth";

export function useRegister() {
  const { saveSession } = useAuth();

  return useMutation({
    mutationFn: registerUser,

    onSuccess: (result) => {
      saveSession(result.session, true);
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
