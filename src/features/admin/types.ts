export interface CandidateRole {
  id: string
  name: string
}

export interface AdminRole {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminRolePayload {
  name: string
  description?: string
}

export type OnboardingStage =
  | 'verify_email'
  | 'complete_profile'
  | 'take_assessment'
  | 'apply_to_job'
  | 'create_company'
  | 'post_job'
  | 'set_up_screening'
  | 'publish_job'
  | 'active'

export type FollowUpStatus = 'none' | 'emailed' | 'progressed'

export interface OnboardingSummary {
  stage: OnboardingStage
  emailsSent: number
  lastEmailAt: string | null
  followUp: FollowUpStatus
}

export interface OnboardingEmailRecord {
  id: string
  userId: string
  sentById: string | null
  stage: OnboardingStage
  subject: string
  body: string
  status: 'sent' | 'failed'
  error: string | null
  createdAt: string
}

export interface UserOnboarding {
  userId: string
  role: 'talent' | 'recruiter'
  stage: OnboardingStage
  steps: { key: string; label: string; done: boolean }[]
  nextSteps: { steps: string[]; ctaLabel: string; ctaPath: string } | null
  followUp: FollowUpStatus
  emails: OnboardingEmailRecord[]
}

export interface OnboardingFilters {
  onboardingStage?: OnboardingStage | ''
  followUp?: FollowUpStatus | ''
}

export interface AdminTalent {
  id: string
  firstName: string
  lastName: string
  email: string
  experience: string | null
  prescreeningScore: number | null
  cvFileName?: string | null
  cvUrl?: string | null
  cvUploadedAt?: string | null
  locationCountry?: string | null
  createdAt: string
  userRoles: CandidateRole[]
  onboarding?: OnboardingSummary | null
}

export interface AdminTalentProfile extends AdminTalent {
  bio?: string | null
  locationCity?: string | null
  locationState?: string | null
  hasEmbedding: boolean
}

export interface AdminTalentFilters extends OnboardingFilters {
  search?: string
  experience?: string
  roleId?: string
  limit?: number
  offset?: number
  sort?: 'asc' | 'desc'
}

export interface AdminJob {
  id: string
  jobBrief: string
  status: string
  experienceLevel: string
  locationCountry: string
  minSalary: number
  maxSalary: number | null
  createdAt: string
  role?: { id: string; name: string } | null
  organization?: {
    id: string
    name: string
    logoUrl?: string | null
  } | null
  postedBy?: {
    id: string
    firstName: string
    lastName: string
    email: string
  } | null
}

export interface AdminJobFilters {
  search?: string
  status?: string
  roleId?: string
  organizationId?: string
  limit?: number
  offset?: number
  sort?: 'asc' | 'desc'
}

export interface AdminRecruiter {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
  onboarding?: OnboardingSummary | null
}

export interface AdminRecruiterFilters extends OnboardingFilters {
  search?: string
  limit?: number
  offset?: number
  sort?: 'asc' | 'desc'
}

export interface AdminOrganization {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  address?: string | null
  industry?: string | null
  website?: string | null
  facebook?: string | null
  linkedin?: string | null
  twitter?: string | null
  status: 'pending' | 'verified' | 'rejected'
  verifiedAt?: string | null
  createdAt: string
  owner?: {
    id: string
    firstName: string
    lastName: string
    email: string
  } | null
  members?: {
    id: string
    userId: string
    organizationId: string
    workEmail: string
    role: string
    createdAt: string
    user: {
      id: string
      firstName: string
      lastName: string
      email: string
    }
  }[]
}

export interface AdminOrganizationFilters {
  search?: string
  status?: string
  limit?: number
  offset?: number
  sort?: 'asc' | 'desc'
}

export interface AdminFeedback {
  id: string
  subject: string | null
  message: string
  isRead: boolean
  createdAt: string
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
  } | null
}

export interface AdminFeedbackFilters {
  isRead?: boolean
  limit?: number
  skip?: number
}
