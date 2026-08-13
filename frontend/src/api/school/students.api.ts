import { api } from "../axiosInstance";

import type {
  CreateStudentRequest,
  CreateStudentResponse,
  Student,
  StudentsResponse,
} from "../../types/Admin/student.types";

<<<<<<< HEAD
const STUDENT_ENDPOINT = "/api/v1/students";

export async function getStudents(): Promise<Student[]> {
  const { data: response } =
    await api.get<StudentsResponse>(
      STUDENT_ENDPOINT,
=======
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
>>>>>>> 93a7cf20e300e9cf9a36f5bd400d9f2ef5693e14
    );

  if (!response.is_success) {
    throw new Error(
      response.message ??
        "Ardayda lama soo heli karo",
    );
  }

  return response.data ?? [];
}

// POST /api/student/create  — roles: ADMIN | STUDENT_AFFAIRS
export async function createStudent(
  request: CreateStudentRequest,
): Promise<Student | null> {
  const { data: response } =
<<<<<<< HEAD
    await api.post<CreateStudentResponse>(
      STUDENT_ENDPOINT,
=======
    await api.post<StudentApiResponse>(
      STUDENT_CREATE_ENDPOINT,
>>>>>>> 93a7cf20e300e9cf9a36f5bd400d9f2ef5693e14
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