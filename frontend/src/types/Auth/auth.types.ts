export type UserRole =
  | "ADMIN"
  | "STUDENT_AFFAIRS"
  | "CASHIER";

// Backend-ku wuxuu hadda soo celin karaa labada format.
export type BackendUserRole =
  | UserRole
  | "StudentAffairs"
  | "Cashier";

export interface LoginRequest {
  emailaddress: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  new_password: string;
}

export interface CreateUserRequest {
  fullname: string;
  emailaddress: string;
  password: string;
  role: UserRole;
}

export interface RegisterRequest {
  fullname: string;
  emailaddress: string;
  password: string;
  role: UserRole;
}
export interface BackendUser {
  id: number;
  fullname: string;
  emailaddress: string;
  role: BackendUserRole;
  Createdat: string;
  Updatedat: string;
  DeletedAt: string;
}

export interface LoginApiResponse {
  data: {
    User: BackendUser;
    Access_token: string;
    Refresh_token: string;
  };
  is_sucess: boolean;
  messege: string;
}

export interface MessageApiResponse {
  message?: string;
  messege?: string;
  is_sucess?: boolean;
}

export interface AuthUser {
  id: number;
  fullName: string;
  emailAddress: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface LoginResult {
  session: AuthSession;
  message: string;
}

export interface MessageResult {
  message: string;
}