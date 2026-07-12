import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  createClass,
  getClasses,
} from "../../api/school/classes.api";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

const classesQueryKey = ["school-classes"];

export function useClasses() {
  return useQuery({
    queryKey: classesQueryKey,
    queryFn: getClasses,
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClass,

    onSuccess: async () => {
      toast.success("Class-ka si guul leh ayaa loo sameeyay");

      // Dib u soo qaad class list-ka kadib create.
      await queryClient.invalidateQueries({
        queryKey: classesQueryKey,
      });
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Class-ka lama samayn karin",
        ),
      );
    },
  });
}