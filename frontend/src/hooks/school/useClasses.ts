import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  createClass,
  getClasses,
  updateClass,
} from "../../api/school/classes.api";

import type { UpdateClassRequest } from "../../types/Admin/class.types";
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

export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classId,
      data,
    }: {
      classId: number;
      data: UpdateClassRequest;
    }) => updateClass(classId, data),

    onSuccess: async () => {
      toast.success(
        "Class-ka si guul leh ayaa loo cusboonaysiiyay",
      );

      await queryClient.invalidateQueries({
        queryKey: classesQueryKey,
      });
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Class-ka lama cusboonaysiin karin",
        ),
      );
    },
  });
}