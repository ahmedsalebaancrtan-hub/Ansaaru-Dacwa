import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  addStudentToClass,
  deactivateStudentClass,
  getStudentClassesByClassId,
} from "../../api/school/studentClasses.api";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

// Query key factory — per-class caching so each class ID gets its own cache slot.
const studentClassesQueryKey = (classId?: number) =>
  classId !== undefined
    ? ["student-classes", classId]
    : ["student-classes"];

/**
 * Fetches the student-class assignments for a specific class.
 * Pass `classId` to enable the query; omit it to keep it disabled
 * (e.g. when the user hasn't selected a class yet).
 */
export function useStudentClasses(classId?: number) {
  return useQuery({
    queryKey: studentClassesQueryKey(classId),
    queryFn: () => {
      if (classId === undefined) return [];
      return getStudentClassesByClassId(classId);
    },
    // Only run the query when a class has been selected.
    enabled: classId !== undefined,
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

      // Invalidate all student-class queries (any class).
      await queryClient.invalidateQueries({
        queryKey: ["student-classes"],
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

export function useDeactivateStudentClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentId: number) =>
      deactivateStudentClass(studentId),

    onSuccess: async () => {
      toast.success(
        "Ardayga fasalka waa laga saaray",
      );

      // Refresh any active student-class list.
      await queryClient.invalidateQueries({
        queryKey: ["student-classes"],
      });
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Ardayga fasalka laga saari karin",
        ),
      );
    },
  });
}