import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  getSalaryHistory,
  paySalary,
} from "../../api/school/salaries.api";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

const salariesQueryKey = [
  "salary-history",
];

export function useSalaryHistory() {
  return useQuery({
    queryKey: salariesQueryKey,
    queryFn: getSalaryHistory,
  });
}

export function usePaySalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paySalary,

    onSuccess: async () => {
      toast.success(
        "Mushaharka waa la bixiyay",
      );

      await queryClient.invalidateQueries({
        queryKey: salariesQueryKey,
      });
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Mushaharka lama bixin ",
        ),
      );
    },
  });
}