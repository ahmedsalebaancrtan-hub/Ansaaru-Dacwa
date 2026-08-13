import type { SchoolClass } from "./class.types";
import type { Student } from "./student.types";

export interface AttendanceInput {
  student_id: number;
  status: string;
  remarks: string;
}

export interface CreateAttendanceRequest {
  class_id: number;
  date: string;
  attendances: AttendanceInput[];
}

export interface ClassAttendanceRequest {
  class_id: number;
  date: string;
}

export interface Attendance {
  id: number;

  student_id: number;
  student: Student;

  class_id: number;
  class: SchoolClass;

  date: string;
  status: string;
  remarks: string;

  created_at: string;
  updated_at: string;
}

export interface AttendanceListResponse {
  data: Attendance[];
  is_success: boolean;
  message?: string;
}

export interface CreateAttendanceResponse {
  data?: Attendance[] | Attendance;
  is_success?: boolean;
  message?: string;
}