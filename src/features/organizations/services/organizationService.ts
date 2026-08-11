import { httpClient } from '@/features/auth/services/httpClient'

import {
  CreateOrganizationPayload,
  OrganizationApiResponse,
  OrganizationsApiResponse,
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
