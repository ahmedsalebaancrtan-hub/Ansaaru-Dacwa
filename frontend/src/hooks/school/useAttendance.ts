import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  createAttendance,
  getClassAttendance,
} from "../../api/school/attendance.api";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

import type { ClassAttendanceRequest } from "../../types/Admin/attendance.types";

export function useClassAttendance(
  request: ClassAttendanceRequest,
) {
  return useQuery({
    queryKey: [
      "class-attendance",
      request.class_id,
      request.date,
    ],

    queryFn: () =>
      getClassAttendance(request),

    enabled:
      request.class_id > 0 &&
      Boolean(request.date),
  });
}

export function useCreateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAttendance,

    onSuccess: async () => {
      toast.success(
        "Attendance-ka  waa la kaydiyay",
      );

      await queryClient.invalidateQueries({
        queryKey: ["class-attendance"],
      });
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Attendance-ka lama kaydin ",
        ),
      );
    },
  });
}