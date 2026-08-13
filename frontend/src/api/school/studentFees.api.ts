import { api } from "../axiosInstance";

import type {
  PayStudentFeeRequest,
  PayStudentFeeResponse,
  StudentFeePayment,
  StudentFeePaymentsResponse,
} from "../../types/Admin/studentFee.types";

const STUDENT_FEES_ENDPOINT =
  "/api/v1/student-fees";

export async function getStudentFeePayments(): Promise<
  StudentFeePayment[]
> {
  const { data: response } =
    await api.get<StudentFeePaymentsResponse>(
      STUDENT_FEES_ENDPOINT,
    );

  if (!response.is_success) {
    throw new Error(
      response.message ??
        "Lacagaha ardayda lama soo heli karin",
    );
  }

  return response.data ?? [];
}

export async function payStudentFee(
  request: PayStudentFeeRequest,
): Promise<PayStudentFeeResponse> {
  const { data: response } =
    await api.post<PayStudentFeeResponse>(
      STUDENT_FEES_ENDPOINT,
      request,
    );

  if (response.is_success === false) {
    throw new Error(
      response.message ??
        "Lacagta ardayga lama kaydin karin",
    );
  }

  return response;
}