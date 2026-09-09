export type OrganizationStatus = 'pending' | 'verified' | 'rejected'

export type OrganizationJoinRequestStatus = 'pending' | 'approved' | 'rejected'

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
  logoUrl?: string | null
  status: OrganizationStatus
  verifiedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface OrganizationJoinRequest {
  id: string
  userId: string
  organizationId: string
  workEmail: string
  status: OrganizationJoinRequestStatus
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
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
  logoUrl?: string
}

/** Email and website are immutable after creation, so they are absent here. */
export interface UpdateOrganizationPayload {
  name?: string
  phone?: string
  address?: string
  industry?: string
  facebook?: string
  linkedin?: string
  twitter?: string
  logoUrl?: string
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

export interface JoinRequestsApiResponse {
  status: boolean
  message: string
  data: { joinRequests: OrganizationJoinRequest[] }
}

export interface JoinOrganizationRequestPayload {
  workEmail: string
}
