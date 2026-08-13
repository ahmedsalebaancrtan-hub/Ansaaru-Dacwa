import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  assignSubjects,
  getSubjects,
} from "../../api/school/subjects.api";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

const subjectsQueryKey = ["subjects"];

export function useSubjects() {
  return useQuery({
    queryKey: subjectsQueryKey,
    queryFn: getSubjects,
  });
}

export function useAssignSubjects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignSubjects,

    onSuccess: async () => {
      toast.success(
        "Maadooyinka fasalka waa  lagu daray",
      );

      await queryClient.invalidateQueries({
        queryKey: subjectsQueryKey,
      });
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Maadooyinka laguma darin fasalka",
        ),
      );
    },
  });
}