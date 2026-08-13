import type { SchoolClass } from "./class.types";
import type { Family } from "./family.types";

export interface Student {
  id: number;
  student_code: string;
  full_name: string;

  class_id: number;
  class: SchoolClass;

  date_of_admission: string;
  discount_fee: number;
  mobile_number: string;

  family_id: number;
  family?: Family;

  gender?: string;

  created_at: string;
  updated_at: string;
}

export interface CreateStudentRequest {
  full_name: string;
  student_code: string;

  class_id: number;
  date_of_admission: string;
  family_id: number;
  discount_fee: number;
  mobile_number: string;

  gender: string;
}

export interface StudentsResponse {
  data: Student[];
  is_success: boolean;
  message?: string;
}

export interface CreateStudentResponse {
  data?: Student;
  is_success?: boolean;
  message?: string;
}