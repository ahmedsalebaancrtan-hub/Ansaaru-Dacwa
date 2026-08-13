import { api } from "../axiosInstance";

import type {
  Attendance,
  AttendanceListResponse,
  ClassAttendanceRequest,
  CreateAttendanceRequest,
  CreateAttendanceResponse,
} from "../../types/Admin/attendance.types";

const ATTENDANCE_ENDPOINT =
  "/api/v1/attendances";

export async function getClassAttendance(
  request: ClassAttendanceRequest,
): Promise<Attendance[]> {
  const { data: response } =
    await api.get<AttendanceListResponse>(
      ATTENDANCE_ENDPOINT,
      {
        params: {
          class_id: request.class_id,
          date: request.date,
        },
      },
    );

  if (!response.is_success) {
    throw new Error(
      response.message ??
        "Attendance-ka lama soo heli karin",
    );
  }

  return response.data ?? [];
}

export async function createAttendance(
  request: CreateAttendanceRequest,
): Promise<CreateAttendanceResponse> {
  const { data: response } =
    await api.post<CreateAttendanceResponse>(
      ATTENDANCE_ENDPOINT,
      request,
    );

  if (response.is_success === false) {
    throw new Error(
      response.message ??
        "Attendance-ka lama kaydin karin",
    );
  }

  return response;
}