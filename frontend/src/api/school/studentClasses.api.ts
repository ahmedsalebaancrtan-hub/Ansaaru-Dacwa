import { api } from "../axiosInstance";

import type {
  AddStudentClassRequest,
  DeactivateStudentClassApiResponse,
  StudentClass,
  StudentClassApiResponse,
  StudentClassesApiResponse,
} from "../../types/Admin/studentClass.types";

// Endpoint builders — match route.go exactly (note: Add and Deactivate are capitalised).
const STUDENT_CLASS_ADD_ENDPOINT = "/api/student_class/Add";

function studentClassListEndpoint(classId: number): string {
  return `/api/student_class/list/${classId}`;
}

function studentClassDeactivateEndpoint(studentId: number): string {
  return `/api/student_class/Deactivate/${studentId}`;
}

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

// GET /api/student_class/list/:class_id  — roles: ADMIN | STUDENT_AFFAIRS | CASHIER
export async function getStudentClassesByClassId(
  classId: number,
): Promise<StudentClass[]> {
  const { data: response } =
    await api.get<StudentClassesApiResponse>(
      studentClassListEndpoint(classId),
    );

  const requestWasSuccessful =
    response.is_sucess !== false &&
    response.is_success !== false;

  if (!requestWasSuccessful) {
    throw new Error(
      getResponseMessage(
        response,
        "Ardayda fasalka lama soo heli karin",
      ),
    );
  }

  return response.data ?? [];
}

// POST /api/student_class/Add  — roles: ADMIN | STUDENT_AFFAIRS
export async function addStudentToClass(
  request: AddStudentClassRequest,
): Promise<StudentClass | null> {
  const { data: response } =
    await api.post<StudentClassApiResponse>(
      STUDENT_CLASS_ADD_ENDPOINT,
      request,
    );

  const requestWasSuccessful =
    response.is_sucess !== false &&
    response.is_success !== false;

  if (!requestWasSuccessful) {
    throw new Error(
      getResponseMessage(
        response,
        "Ardayga fasalka laguma dari karin",
      ),
    );
  }

  return response.data ?? null;
}

// PUT /api/student_class/Deactivate/:student_id  — roles: ADMIN | STUDENT_AFFAIRS
export async function deactivateStudentClass(
  studentId: number,
): Promise<void> {
  const { data: response } =
    await api.put<DeactivateStudentClassApiResponse>(
      studentClassDeactivateEndpoint(studentId),
    );

  const requestWasSuccessful =
    response.is_sucess !== false &&
    response.is_success !== false;

  if (!requestWasSuccessful) {
    throw new Error(
      getResponseMessage(
        response,
        "Ardayga fasalka laga saari karin",
      ),
    );
  }
}