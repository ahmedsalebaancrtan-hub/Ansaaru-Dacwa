import type { Student } from "./student.types";
import type { Subject } from "./subject.types";

export interface Exam {
  id: number;
  title: string;
  academic_year: string;
  term: string;
  exam_type: string;
  max_marks: number;
  created_at: string;
  updated_at: string;
}

export interface CreateExamRequest {
  title: string;
  academic_year: string;
  term: string;
  exam_type: string;
  max_marks: number;
}

export interface SubmitMarkItem {
  student_id: number;
  subject_id: number;
  marks_obtained: number;
  remarks: string;
}

export interface SubmitMarksRequest {
  exam_id: number;
  marks: SubmitMarkItem[];
}

export interface StudentExamReportRequest {
  exam_id: number;
  student_id: number;
}

export interface ExamSubjectMark {
  id: number;

  exam_id: number;
  exam: Exam;

  student_id: number;
  student: Student;

  subject_id: number;
  subject: Subject;

  marks_obtained: number;
  grade: string;
  remarks: string;

  created_at: string;
  updated_at: string;
}

export interface StudentExamReport {
  exam: Exam;

  overall_grade: string;
  percentage: number;

  student: Student;

  subject_marks: ExamSubjectMark[];

  total_max: number;
  total_obtained: number;
}

export interface StudentExamReportResponse {
  data: StudentExamReport;
  is_success: boolean;
  message?: string;
}

export interface ExamMutationResponse {
  data?: Exam;
  is_success?: boolean;
  message?: string;
}

export interface SubmitMarksResponse {
  data?: unknown;
  is_success?: boolean;
  message?: string;
}