import { api } from "../axiosInstance";

import type {
  ClassApiResponse,
  ClassesApiResponse,
  CreateClassRequest,
  SchoolClass,
} from "../../types/Admin/class.types";

// Haddii backend route-ku ka duwan yahay, halkaan keliya beddel.
const CLASS_ENDPOINT = "/api/v1/classes";

export async function getClasses(): Promise<SchoolClass[]> {
  const { data: response } =
    await api.get<ClassesApiResponse>(CLASS_ENDPOINT);

  const requestWasSuccessful =
    response.is_sucess !== false &&
    response.is_success !== false;

  if (!requestWasSuccessful) {
    throw new Error(
      response.message ??
        response.messege ??
        "Classes lama soo heli karin",
    );
  }

  return response.data ?? [];
}

export async function createClass(
  request: CreateClassRequest,
): Promise<SchoolClass> {
  const { data: response } =
    await api.post<ClassApiResponse>(
      CLASS_ENDPOINT,
      request,
    );

  const requestWasSuccessful =
    response.is_sucess !== false &&
    response.is_success !== false;

  if (!requestWasSuccessful || !response.data) {
    throw new Error(
      response.message ??
        response.messege ??
        "Class-ka lama samayn karin",
    );
  }

  return response.data;
}