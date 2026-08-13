export interface Employee {
  id: number;
  full_name: string;
  phone: string;
  role: string;
  picture_url: string;
  date_of_joining: string;
  monthly_salary: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeRequest {
  full_name: string;
  phone: string;
  role: string;
  picture_url: string;
  date_of_joining: string;
  monthly_salary: number;
}

export interface EmployeesResponse {
  data: Employee[];
  is_success: boolean;
  message?: string;
}

export interface CreateEmployeeResponse {
  data?: Employee;
  is_success?: boolean;
  message?: string;
}