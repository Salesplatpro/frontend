import { httpClient } from '@/features/auth/services/httpClient'

import {
  CreateOrganizationPayload,
  JoinOrganizationRequestPayload,
  JoinRequestsApiResponse,
  OrganizationApiResponse,
  OrganizationsApiResponse,
  UpdateOrganizationPayload,
} from '../types'

export const MY_ORGANIZATIONS_ENDPOINT = '/organizations/me'

export const fetchMyOrganizations = () =>
  httpClient
    .get<OrganizationsApiResponse>(MY_ORGANIZATIONS_ENDPOINT)
    .then((response) => response.data)

export const createOrganization = (payload: CreateOrganizationPayload) =>
  httpClient
    .post<OrganizationApiResponse>('/organizations', payload)
    .then((response) => response.data)

export const switchOrganization = (organizationId: string) =>
  httpClient
    .patch<OrganizationApiResponse>(`/organizations/${organizationId}/switch`)
    .then((response) => response.data)

export const updateOrganization = (
  organizationId: string,
  payload: UpdateOrganizationPayload,
) =>
  httpClient
    .patch<OrganizationApiResponse>(`/organizations/${organizationId}`, payload)
    .then((response) => response.data)

export const deleteOrganization = (organizationId: string) =>
  httpClient
    .delete(`/organizations/${organizationId}`)
    .then((response) => response.data)

export const fetchVerifiedOrganizations = (search?: string) =>
  httpClient
    .get<OrganizationsApiResponse>('/organizations/verified', {
      params: search ? { search } : undefined,
    })
    .then((response) => response.data)

export const requestJoinOrganization = (
  organizationId: string,
  payload: JoinOrganizationRequestPayload,
) =>
  httpClient
    .post<{ status: boolean; message: string }>(
      `/organizations/${organizationId}/join-request`,
      payload,
    )
    .then((response) => response.data)

export const fetchOrganizationJoinRequests = (organizationId: string) =>
  httpClient
    .get<JoinRequestsApiResponse>(
      `/organizations/${organizationId}/join-requests`,
    )
    .then((response) => response.data)

export const approveJoinRequest = (requestId: string) =>
  httpClient
    .patch<OrganizationApiResponse>(
      `/organizations/join-requests/${requestId}/approve`,
    )
    .then((response) => response.data)

export const rejectJoinRequest = (requestId: string) =>
  httpClient
    .patch<{ status: boolean; message: string }>(
      `/organizations/join-requests/${requestId}/reject`,
    )
    .then((response) => response.data)
