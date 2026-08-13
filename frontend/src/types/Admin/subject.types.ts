import type { SchoolClass } from "./class.types";

export interface Subject {
  id: number;
  name: string;
  marks: number;
  class_id: number;
  class: SchoolClass;
  created_at: string;
  updated_at: string;
}

export interface SubjectInput {
  name: string;
  marks: number;
}

export interface AssignSubjectsRequest {
  class_id: number;
  subjects: SubjectInput[];
}

export interface SubjectsResponse {
  data: Subject[];
  is_success: boolean;
  message?: string;
}

export interface AssignSubjectsResponse {
  data?: Subject[] | Subject;
  is_success?: boolean;
  message?: string;
}