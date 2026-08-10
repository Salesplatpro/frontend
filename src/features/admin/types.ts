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
  phone?: string | null
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
  phone?: string | null
  createdAt: string
  organization?: {
    id: string
    name: string
  } | null
}

export interface AdminRecruiterFilters {
  search?: string
  limit?: number
  offset?: number
  sort?: 'asc' | 'desc'
}
