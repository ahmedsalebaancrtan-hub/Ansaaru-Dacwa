import { api } from "../axiosInstance";

import type {
  CreateStudentRequest,
  Student,
  StudentApiResponse,
  StudentsApiResponse,
} from "../../types/Admin/student.types";

// Ku beddel route-ka saxda ah haddii backend-ku ka duwan yahay.
const STUDENT_ENDPOINT = "/api/v1/students";

function getResponseMessage(
  response: {
    message?: string;
    messege?: string;
  },
  fallbackMessage: string,
): string {
  return (
    response.message ??
    response.messege ??
    fallbackMessage
  );
}

export async function getStudents(): Promise<Student[]> {
  const { data: response } =
    await api.get<StudentsApiResponse>(
      STUDENT_ENDPOINT,
    );

  const requestWasSuccessful =
    response.is_sucess !== false &&
    response.is_success !== false;

  if (!requestWasSuccessful) {
    throw new Error(
      getResponseMessage(
        response,
        "Ardayda lama soo heli karin",
      ),
    );
  }

  return response.data ?? [];
}

export async function createStudent(
  request: CreateStudentRequest,
): Promise<Student | null> {
  const { data: response } =
    await api.post<StudentApiResponse>(
      STUDENT_ENDPOINT,
      request,
    );

  const requestWasSuccessful =
    response.is_sucess !== false &&
    response.is_success !== false;

  if (!requestWasSuccessful) {
    throw new Error(
      getResponseMessage(
        response,
        "Ardayga lama diiwaangelin karin",
      ),
    );
  }

  return response.data ?? null;
}