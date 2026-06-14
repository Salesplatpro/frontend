import { AUTH_ENDPOINTS } from '@/services/api/endpoints'

import {
  AuthApiResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  RecruiterRegisterRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  TalentRegisterRequest,
} from '../types'
import { httpClient } from './httpClient'

export const loginRequest = (payload: LoginRequest) =>
  httpClient.post<AuthApiResponse>(AUTH_ENDPOINTS.LOGIN, payload)

export const registerTalent = (payload: TalentRegisterRequest) =>
  httpClient.post<AuthApiResponse>(AUTH_ENDPOINTS.REGISTER_TALENT, payload)

export const registerRecruiter = (payload: RecruiterRegisterRequest) =>
  httpClient.post<AuthApiResponse>(AUTH_ENDPOINTS.REGISTER_RECRUITER, payload)

export const requestPasswordOtp = (payload: ForgotPasswordRequest) =>
  httpClient.post<ForgotPasswordResponse>(
    AUTH_ENDPOINTS.FORGOT_PASSWORD,
    payload,
  )

export const resetPasswordRequest = (payload: ResetPasswordRequest) =>
  httpClient.post<ResetPasswordResponse>(AUTH_ENDPOINTS.RESET_PASSWORD, payload)
