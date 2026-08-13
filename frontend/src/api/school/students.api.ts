import { api } from "../axiosInstance";

import type {
  CreateStudentRequest,
  CreateStudentResponse,
  Student,
  StudentsResponse,
} from "../../types/Admin/student.types";

const STUDENT_ENDPOINT = "/api/v1/students";

export async function getStudents(): Promise<Student[]> {
  const { data: response } =
    await api.get<StudentsResponse>(
      STUDENT_ENDPOINT,
    );

  if (!response.is_success) {
    throw new Error(
      response.message ??
        "Ardayda lama soo heli karo",
    );
  }

  return response.data ?? [];
}

export async function createStudent(
  request: CreateStudentRequest,
): Promise<Student | null> {
  const { data: response } =
    await api.post<CreateStudentResponse>(
      STUDENT_ENDPOINT,
      request,
    );

  if (response.is_success === false) {
    throw new Error(
      response.message ??
        "Ardayga lama diiwaangelin karo",
    );
  }

  return response.data ?? null;
}