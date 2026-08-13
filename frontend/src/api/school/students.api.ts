import { api } from "../axiosInstance";

import type {
  CreateStudentRequest,
  CreateStudentResponse,
  Student,
  StudentsResponse,
} from "../../types/Admin/student.types";

const STUDENT_LIST_ENDPOINT =
  "/api/student/list";

const STUDENT_CREATE_ENDPOINT =
  "/api/student/create";

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

// GET /api/student/list
export async function getStudents(): Promise<
  Student[]
> {
  const { data: response } =
    await api.get<StudentsResponse>(
      STUDENT_LIST_ENDPOINT,
    );

  if (!response.is_success) {
    throw new Error(
      getResponseMessage(
        response,
        "Ardayda lama soo heli karo",
      ),
    );
  }

  return response.data ?? [];
}

// POST /api/student/create
export async function createStudent(
  request: CreateStudentRequest,
): Promise<Student | null> {
  const { data: response } =
    await api.post<CreateStudentResponse>(
      STUDENT_CREATE_ENDPOINT,
      request,
    );

  if (response.is_success === false) {
    throw new Error(
      getResponseMessage(
        response,
        "Ardayga lama diiwaangelin karo",
      ),
    );
  }

  return response.data ?? null;
}