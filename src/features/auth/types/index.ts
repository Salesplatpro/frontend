export type UserRole = 'talent' | 'recruiter' | 'admin'

export interface AuthUser {
  id?: string
  firstName?: string
  lastName?: string
  email?: string
  userRole?: UserRole
  emailVerifiedAt?: string | null
  profile?: Record<string, any>
  [key: string]: unknown
}

export interface AuthResponseData {
  user: AuthUser
  token: string
}

export interface AuthApiResponse {
  status?: boolean
  message?: string
  data: AuthResponseData
}

export interface LoginRequest {
  email: string
  password: string
}

export interface TalentRegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export type RecruiterRegisterRequest = TalentRegisterRequest

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  status?: boolean
  message?: string
}

export interface ResetPasswordRequest {
  email: string
  otp: string | number
  password: string
}

export interface ResetPasswordResponse {
  status?: boolean
  message?: string
}

export interface VerifyEmailRequest {
  token: string
}

export interface VerifyEmailResponse {
  status?: boolean
  message?: string
}

export interface ChangeEmailRequest {
  newEmail: string
  currentPassword: string
}
