import { api } from "../axiosInstance";

import type {
  AddStudentClassRequest,
  StudentClass,
  StudentClassApiResponse,
  StudentClassesApiResponse,
} from "../../types/Admin/studentClass.types";

// Route-kan ku beddel endpoint-ka saxda ah haddii uu ka duwan yahay.
const STUDENT_CLASS_ENDPOINT =
  "/api/v1/student-classes";

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

export async function getStudentClasses(): Promise<
  StudentClass[]
> {
  const { data: response } =
    await api.get<StudentClassesApiResponse>(
      STUDENT_CLASS_ENDPOINT,
    );

  const requestWasSuccessful =
    response.is_sucess !== false &&
    response.is_success !== false;

  if (!requestWasSuccessful) {
    throw new Error(
      getResponseMessage(
        response,
        "Xogta fasallada ardayda lama soo heli karin",
      ),
    );
  }

  return response.data ?? [];
}

export async function addStudentToClass(
  request: AddStudentClassRequest,
): Promise<StudentClass | null> {
  const { data: response } =
    await api.post<StudentClassApiResponse>(
      STUDENT_CLASS_ENDPOINT,
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