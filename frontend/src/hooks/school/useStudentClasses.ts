import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  addStudentToClass,
  getStudentClasses,
} from "../../api/school/studentClasses.api";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

const studentClassesQueryKey = [
  "student-classes",
];

export function useStudentClasses() {
  return useQuery({
    queryKey: studentClassesQueryKey,
    queryFn: getStudentClasses,
  });
}

export function useAddStudentToClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addStudentToClass,

    onSuccess: async () => {
      toast.success(
        "Ardayga fasalka si guul leh ayaa loogu daray",
      );

      // Liiska dib ayaa loo soo qaadayaa kadib create.
      await queryClient.invalidateQueries({
        queryKey: studentClassesQueryKey,
      });
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Ardayga fasalka laguma dari karin",
        ),
      );
    },
  });
}