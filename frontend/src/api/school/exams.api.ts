import { api } from "../axiosInstance";

import type {
  CreateExamRequest,
  ExamMutationResponse,
  StudentExamReport,
  StudentExamReportRequest,
  StudentExamReportResponse,
  SubmitMarksRequest,
  SubmitMarksResponse,
} from "../../types/Admin/exam.types";

const EXAMS_ENDPOINT = "/api/v1/exams";

const EXAM_MARKS_ENDPOINT =
  "/api/v1/exams/marks";

const EXAM_REPORT_ENDPOINT =
  "/api/v1/exams/report";

export async function createExam(
  request: CreateExamRequest,
): Promise<ExamMutationResponse> {
  const { data: response } =
    await api.post<ExamMutationResponse>(
      EXAMS_ENDPOINT,
      request,
    );

  if (response.is_success === false) {
    throw new Error(
      response.message ??
        "Imtixaan lama samayn",
    );
  }

  return response;
}

export async function submitExamMarks(
  request: SubmitMarksRequest,
): Promise<SubmitMarksResponse> {
  const { data: response } =
    await api.post<SubmitMarksResponse>(
      EXAM_MARKS_ENDPOINT,
      request,
    );

  if (response.is_success === false) {
    throw new Error(
      response.message ??
        "Dhibcaha lama kaydin",
    );
  }

  return response;
}

export async function getStudentExamReport(
  request: StudentExamReportRequest,
): Promise<StudentExamReport> {
  const { data: response } =
    await api.get<StudentExamReportResponse>(
      EXAM_REPORT_ENDPOINT,
      {
        params: {
          exam_id: request.exam_id,
          student_id: request.student_id,
        },
      },
    );

  if (!response.is_success) {
    throw new Error(
      response.message ??
        "Natiijada ardayga lama heli",
    );
  }

  return response.data;
}