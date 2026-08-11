export type OrganizationStatus = 'pending' | 'verified' | 'rejected'

export interface Organization {
  id: string
  ownerId: string
  name: string
  email?: string | null
  phone?: string | null
  address?: string | null
  industry?: string | null
  website?: string | null
  facebook?: string | null
  linkedin?: string | null
  twitter?: string | null
  status: OrganizationStatus
  verifiedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateOrganizationPayload {
  name: string
  email: string
  phone?: string
  address?: string
  industry?: string
  website?: string
  facebook?: string
  linkedin?: string
  twitter?: string
}

export interface OrganizationsApiResponse {
  status: boolean
  message: string
  data: { organizations: Organization[] }
}

export interface OrganizationApiResponse {
  status: boolean
  message: string
  data: { organization: Organization }
}
