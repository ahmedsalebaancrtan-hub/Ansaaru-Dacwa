import type { Employee } from "./employee.types";

export interface PaySalaryRequest {
  employee_id: number;
  month: string;
  base_salary: number;
  bonus: number;
  deduction: number;
  payment_method: string;
  remarks: string;
}

export interface SalaryPayment {
  id: number;

  employee_id: number;
  employee: Employee;

  month: string;

  base_salary: number;
  bonus: number;
  deduction: number;
  net_salary: number;

  payment_method: string;
  remarks: string;

  paid_at: string;
  created_at: string;
  updated_at: string;
}

export interface SalaryHistoryResponse {
  data: SalaryPayment[];
  is_success: boolean;
  message?: string;
}

export interface PaySalaryResponse {
  data?: SalaryPayment;
  is_success?: boolean;
  message?: string;
}