import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  createStudent,
  getStudents,
} from "../../api/school/students.api";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

const studentsQueryKey = ["school-students"];

export function useStudents() {
  return useQuery({
    queryKey: studentsQueryKey,
    queryFn: getStudents,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudent,

    onSuccess: async () => {
      toast.success(
        "Ardayga si guul leh ayaa loo diiwaangeliyay",
      );

      // Dib u soo qaad liiska kadib create.
      await queryClient.invalidateQueries({
        queryKey: studentsQueryKey,
      });
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Ardayga lama diiwaangelin karin",
        ),
      );
    },
  });
}