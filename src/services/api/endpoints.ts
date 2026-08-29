export const AUTH_ENDPOINTS = {
  REGISTER_TALENT: '/auth/register',
  REGISTER_RECRUITER: '/auth/register/recruiter',
  LOGIN: '/auth/login',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',
  CHANGE_EMAIL: '/auth/change-email',
} as const
