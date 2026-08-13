import { api } from "../axiosInstance";

import type {
  AssignSubjectsRequest,
  AssignSubjectsResponse,
  Subject,
  SubjectsResponse,
} from "../../types/Admin/subject.types";

const SUBJECTS_ENDPOINT = "/api/v1/subjects";

export async function getSubjects(): Promise<
  Subject[]
> {
  const { data: response } =
    await api.get<SubjectsResponse>(
      SUBJECTS_ENDPOINT,
    );

  if (!response.is_success) {
    throw new Error(
      response.message ??
        "Maadooyinka lama soo heli ",
    );
  }

  return response.data ?? [];
}

export async function assignSubjects(
  request: AssignSubjectsRequest,
): Promise<AssignSubjectsResponse> {
  const { data: response } =
    await api.post<AssignSubjectsResponse>(
      SUBJECTS_ENDPOINT,
      request,
    );

  if (response.is_success === false) {
    throw new Error(
      response.message ??
        "Maadooyinka fasalka laguma darin ",
    );
  }

  return response;
}