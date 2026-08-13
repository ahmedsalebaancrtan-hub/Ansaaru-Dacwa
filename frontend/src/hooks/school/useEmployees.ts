import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  createEmployee,
  getEmployees,
} from "../../api/school/employees.api";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

const employeesQueryKey = ["employees"];

export function useEmployees() {
  return useQuery({
    queryKey: employeesQueryKey,
    queryFn: getEmployees,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,

    onSuccess: async () => {
      toast.success(
        "Shaqaalaha si guul leh ayaa loo diiwaangeliyay",
      );

      await queryClient.invalidateQueries({
        queryKey: employeesQueryKey,
      });
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Shaqaalaha lama diiwaangelin karin",
        ),
      );
    },
  });
}