import { api } from "../axiosInstance";

import type {
  ClassApiResponse,
  ClassesApiResponse,
  CreateClassRequest,
  SchoolClass,
  UpdateClassRequest,
} from "../../types/Admin/class.types";

// Endpoint roots — match route.go exactly.
const CLASS_LIST_ENDPOINT    = "/api/class/list";
const CLASS_CREATE_ENDPOINT  = "/api/class/create";

function classUpdateEndpoint(classId: number): string {
  return `/api/class/update/${classId}`;
}

function classDetailsEndpoint(classId: number): string {
  return `/api/class/details/${classId}`;
}

function getErrorMessage(
  response: { message?: string; messege?: string },
  fallbackMessage: string,
): string {
  return (
    response.message ??
    response.messege ??
    fallbackMessage
  );
}

// GET /api/class/list  — roles: ADMIN | STUDENT_AFFAIRS | CASHIER
export async function getClasses(): Promise<SchoolClass[]> {
  const { data: response } =
    await api.get<ClassesApiResponse>(CLASS_LIST_ENDPOINT);

  const requestWasSuccessful =
    response.is_sucess !== false &&
    response.is_success !== false;

  if (!requestWasSuccessful) {
    throw new Error(
      getErrorMessage(
        response,
        "Fasallada lama soo heli karin",
      ),
    );
  }

  return response.data ?? [];
}

// POST /api/class/create  — no auth middleware on backend (backend gap, noted in plan)
export async function createClass(
  request: CreateClassRequest,
): Promise<SchoolClass> {
  const { data: response } =
    await api.post<ClassApiResponse>(
      CLASS_CREATE_ENDPOINT,
      request,
    );

  const requestWasSuccessful =
    response.is_sucess !== false &&
    response.is_success !== false;

  if (!requestWasSuccessful || !response.data) {
    throw new Error(
      getErrorMessage(
        response,
        "Class-ka lama samayn karin",
      ),
    );
  }

  return response.data;
}

// PUT /api/class/update/:classid  — roles: ADMIN | STUDENT_AFFAIRS
export async function updateClass(
  classId: number,
  request: UpdateClassRequest,
): Promise<void> {
  const { data: response } =
    await api.put<ClassApiResponse>(
      classUpdateEndpoint(classId),
      request,
    );

  const requestWasSuccessful =
    response.is_sucess !== false &&
    response.is_success !== false;

  if (!requestWasSuccessful) {
    throw new Error(
      getErrorMessage(
        response,
        "Class-ka lama cusboonaysiin karin",
      ),
    );
  }
}

// GET /api/class/details/:classid  — roles: ADMIN | STUDENT_AFFAIRS | CASHIER
export async function getClassById(
  classId: number,
): Promise<SchoolClass> {
  const { data: response } =
    await api.get<ClassApiResponse>(
      classDetailsEndpoint(classId),
    );

  const requestWasSuccessful =
    response.is_sucess !== false &&
    response.is_success !== false;

  if (!requestWasSuccessful || !response.data) {
    throw new Error(
      getErrorMessage(
        response,
        "Class-ka xogtiisu lama heli karin",
      ),
    );
  }

  return response.data;
}