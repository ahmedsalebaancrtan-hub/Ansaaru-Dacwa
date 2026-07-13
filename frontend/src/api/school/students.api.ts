import { api } from "../axiosInstance";

import type {
  CreateStudentRequest,
  Student,
  StudentApiResponse,
  StudentsApiResponse,
} from "../../types/Admin/student.types";

// Endpoints — match route.go exactly.
const STUDENT_LIST_ENDPOINT   = "/api/student/list";
const STUDENT_CREATE_ENDPOINT = "/api/student/create";

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

// GET /api/student/list  — roles: ADMIN | STUDENT_AFFAIRS | CASHIER
export async function getStudents(): Promise<Student[]> {
  const { data: response } =
    await api.get<StudentsApiResponse>(
      STUDENT_LIST_ENDPOINT,
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

// POST /api/student/create  — roles: ADMIN | STUDENT_AFFAIRS
export async function createStudent(
  request: CreateStudentRequest,
): Promise<Student | null> {
  const { data: response } =
    await api.post<StudentApiResponse>(
      STUDENT_CREATE_ENDPOINT,
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