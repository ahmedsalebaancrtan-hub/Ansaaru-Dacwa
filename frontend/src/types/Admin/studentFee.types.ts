import type { Student } from "./student.types";

export interface PayStudentFeeRequest {
  student_id: number;
  amount_paid: number;
  month_for: string;
  payment_method: string;
  note: string;
}

export interface StudentFeePayment {
  id: number;
  receipt_no: string;

  student_id: number;
  student: Student;

  amount_paid: number;
  discount: number;

  month_for: string;
  payment_method: string;
  status: string;
  note: string;

  created_at: string;
  updated_at: string;
}

export interface StudentFeePaymentsResponse {
  data: StudentFeePayment[];
  is_success: boolean;
  message?: string;
}

export interface PayStudentFeeResponse {
  data?: StudentFeePayment;
  is_success?: boolean;
  message?: string;
}