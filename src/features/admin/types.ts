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
