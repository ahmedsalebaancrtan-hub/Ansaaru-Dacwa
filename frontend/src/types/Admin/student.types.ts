export type StudentGender = "male" | "female";

export interface StudentFamily {
  id: number;
  familyName: string;
  Parent_one_Name: string;
  parent_one_phone: string;
  Parent_two_name: string;
  Parent_two_phone: string;
  address: string;
  Createdat: string;
  UpdatedAt: string;
}

// Student-ka backend-ka kasoo noqonaya.
export interface Student {
  id: number;
  student_code: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: StudentGender | string;
  Createdat: string;
  UpdatedAt: string;
  familyId: number;
  family?: StudentFamily;
}

// Xogta loo dirayo marka arday cusub la samaynayo.
export interface CreateStudentRequest {
  first_name: string;
  middle_name: string;
  last_name: string;
  student_code: string;
  family_id: number;
  gender: StudentGender;
}

export interface StudentApiResponse {
  data?: Student;
  is_sucess?: boolean;
  is_success?: boolean;
  message?: string;
  messege?: string;
}

export interface StudentsApiResponse {
  data?: Student[];
  is_sucess?: boolean;
  is_success?: boolean;
  message?: string;
  messege?: string;
}