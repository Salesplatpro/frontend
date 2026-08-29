export interface CandidateRole {
  id: string
  name: string
}

export interface Candidate {
  id: string
  firstName: string
  lastName: string
  email: string
  experience: string | null
  prescreeningScore: number | null
  maxSalary: number | null
  userRoles: CandidateRole[]
}

export interface CandidateFilters {
  roleId?: string
  experience?: string
  minScore?: number
  maxSalary?: number
  incomplete?: boolean
  limit?: number
  offset?: number
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

export interface AdminTalent {
  id: string
  firstName: string
  lastName: string
  email: string
  experience: string | null
  prescreeningScore: number | null
  cvFileName?: string | null
  cvUploadedAt?: string | null
  locationCountry?: string | null
  createdAt: string
  userRoles: CandidateRole[]
}

export interface AdminTalentFilters {
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
}

export interface AdminRecruiterFilters {
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
