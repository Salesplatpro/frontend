export type OrganizationStatus = 'pending' | 'verified' | 'rejected'

export type OrganizationJoinRequestStatus = 'pending' | 'approved' | 'rejected'

export interface Organization {
  id: string
  ownerId: string
  name: string
  domain?: string | null
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
  domain: string
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

export type OrganizationInviteStatus =
  | 'pending'
  | 'accepted'
  | 'revoked'
  | 'expired'

export interface OrganizationInvite {
  id: string
  organizationId: string
  email: string
  status: OrganizationInviteStatus
  expiresAt: string
  createdAt: string
}

export interface OrganizationInvitePreview {
  organizationName: string
  invitedEmail: string
  status: OrganizationInviteStatus
  expiresAt: string
  inviteeExists: boolean
  inviteeHasPaidPlan: boolean
}

export interface OrganizationMember {
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
}

export interface MembersApiResponse {
  status: boolean
  message: string
  data: { members: OrganizationMember[] }
}

export interface SendOrganizationInvitePayload {
  email: string
}

export interface InvitesApiResponse {
  status: boolean
  message: string
  data: { invites: OrganizationInvite[] }
}

export interface InviteApiResponse {
  status: boolean
  message: string
  data: { invite: OrganizationInvite }
}

export interface InvitePreviewApiResponse {
  status: boolean
  message: string
  data: { invite: OrganizationInvitePreview }
}
