import { api } from "../axiosInstance";

import type {
  PaySalaryRequest,
  PaySalaryResponse,
  SalaryHistoryResponse,
  SalaryPayment,
} from "../../types/Admin/salary.types";

const SALARIES_ENDPOINT =
  "/api/v1/salaries";

export async function getSalaryHistory(): Promise<
  SalaryPayment[]
> {
  const { data: response } =
    await api.get<SalaryHistoryResponse>(
      SALARIES_ENDPOINT,
    );

  if (!response.is_success) {
    throw new Error(
      response.message ??
        "Taariikhda mushaharka lama helin",
    );
  }

  return response.data ?? [];
}

export async function paySalary(
  request: PaySalaryRequest,
): Promise<PaySalaryResponse> {
  const { data: response } =
    await api.post<PaySalaryResponse>(
      SALARIES_ENDPOINT,
      request,
    );

  if (response.is_success === false) {
    throw new Error(
      response.message ??
        "Mushaharka lama bixin",
    );
  }

  return response;
}