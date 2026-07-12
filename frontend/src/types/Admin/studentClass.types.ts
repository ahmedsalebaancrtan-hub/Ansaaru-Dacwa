import type { SchoolClass } from "./class.types";
import type { Student } from "./student.types";

// Xogta loo dirayo marka arday fasal lagu darayo.
export interface AddStudentClassRequest {
  student_id: number;
  class_id: number;
}

// Xogta assignment-ka kasoo noqonaysa backend-ka.
export interface StudentClass {
  id: number;
  student_id: number;
  class_id: number;
  is_active: boolean;
  Class: SchoolClass;
  Student: Student;
  Createdat: string;
  updatedAt: string;
}

export interface StudentClassApiResponse {
  data?: StudentClass;
  is_sucess?: boolean;
  is_success?: boolean;
  message?: string;
  messege?: string;
}

export interface StudentClassesApiResponse {
  data?: StudentClass[];
  is_sucess?: boolean;
  is_success?: boolean;
  message?: string;
  messege?: string;
}