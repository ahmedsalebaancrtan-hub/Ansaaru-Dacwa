// Family record-ka backend-ka kasoo noqonaya.
export interface Family {
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

// Xogta loo dirayo marka qoys cusub la samaynayo.
export interface CreateFamilyRequest {
  familyName: string;
  Parent_one_Name: string;
  parent_one_phone: string;
  Parent_two_name: string;
  Parent_two_phone: string;
  address: string;
}

export interface FamilyApiResponse {
  data?: Family;
  is_sucess?: boolean;
  is_success?: boolean;
  message?: string;
  messege?: string;
}

export interface FamiliesApiResponse {
  data?: Family[];
  is_sucess?: boolean;
  is_success?: boolean;
  message?: string;
  messege?: string;
}