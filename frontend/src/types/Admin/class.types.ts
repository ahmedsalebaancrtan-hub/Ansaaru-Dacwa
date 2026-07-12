// Class-ka backend-ka kasoo noqonaya.
export interface SchoolClass {
  id: number;
  title: string;
  AcademicYear: string;
  Createdat: string;
  UpdatedAt: string;
}

// Xogta loo dirayo marka class cusub la samaynayo.
export interface CreateClassRequest {
  title: string;
  AcademicYear: string;
}

export interface ClassApiResponse {
  data: SchoolClass;
  is_sucess?: boolean;
  is_success?: boolean;
  messege?: string;
  message?: string;
}

export interface ClassesApiResponse {
  data: SchoolClass[];
  is_sucess?: boolean;
  is_success?: boolean;
  messege?: string;
  message?: string;
}