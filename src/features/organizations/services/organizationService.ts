import { httpClient } from '@/features/auth/services/httpClient'

import {
  CreateOrganizationPayload,
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
