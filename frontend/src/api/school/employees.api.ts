import { api } from "../axiosInstance";

import type {
  CreateEmployeeRequest,
  CreateEmployeeResponse,
  Employee,
  EmployeesResponse,
} from "../../types/Admin/employee.types";

const EMPLOYEE_ENDPOINT = "/api/v1/employees";

export async function getEmployees(): Promise<Employee[]> {
  const { data: response } =
    await api.get<EmployeesResponse>(
      EMPLOYEE_ENDPOINT,
    );

  if (!response.is_success) {
    throw new Error(
      response.message ??
        "Shaqaalaha lama soo helin",
    );
  }

  return response.data ?? [];
}

export async function createEmployee(
  request: CreateEmployeeRequest,
): Promise<Employee | null> {
  const { data: response } =
    await api.post<CreateEmployeeResponse>(
      EMPLOYEE_ENDPOINT,
      request,
    );

  if (response.is_success === false) {
    throw new Error(
      response.message ??
        "Shaqaalaha lama diiwaangelin ",
    );
  }

  return response.data ?? null;
}