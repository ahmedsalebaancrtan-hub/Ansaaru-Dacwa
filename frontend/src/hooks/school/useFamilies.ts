import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  createFamily,
  getFamilies,
} from "../../api/school/families.api";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

const familiesQueryKey = ["school-families"];

export function useFamilies() {
  return useQuery({
    queryKey: familiesQueryKey,
    queryFn: getFamilies,
  });
}

export function useCreateFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFamily,

    onSuccess: async () => {
      toast.success(
        "Qoyska si guul leh ayaa loo sameeyay",
      );

      await queryClient.invalidateQueries({
        queryKey: familiesQueryKey,
      });
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Qoyska lama samayn karin",
        ),
      );
    },
  });
}