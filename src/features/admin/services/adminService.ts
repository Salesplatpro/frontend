import { httpClient } from '@/features/auth/services/httpClient'

import {
  AdminJob,
  AdminJobFilters,
  AdminOrganization,
  AdminOrganizationFilters,
  AdminRecruiter,
  AdminRecruiterFilters,
  AdminRole,
  AdminRolePayload,
  AdminTalent,
  AdminTalentFilters,
  Candidate,
  CandidateFilters,
} from '../types'

interface ApiEnvelope<T> {
  status: boolean
  message: string
  data: T
}

export const fetchCandidates = (filters: CandidateFilters = {}) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  )
  return httpClient
    .get<ApiEnvelope<{ users: Candidate[] }>>('/user/profile/', { params })
    .then((response) => response.data.data.users)
}

export const fetchRoles = () =>
  httpClient
    .get<ApiEnvelope<{ roles: AdminRole[] }>>('/roles', {
      params: { limit: 1000 },
    })
    .then((response) => response.data.data.roles)

export const createRole = (payload: AdminRolePayload) =>
  httpClient
    .post<ApiEnvelope<{ role: AdminRole }>>('/roles', payload)
    .then((response) => response.data.data.role)

export const updateRole = (id: string, payload: AdminRolePayload) =>
  httpClient
    .patch<ApiEnvelope<{ role: AdminRole }>>(`/roles/${id}`, payload)
    .then((response) => response.data.data.role)

export const deleteRole = (id: string) =>
  httpClient
    .delete<ApiEnvelope<null>>(`/roles/${id}`)
    .then((response) => response.data)

export const fetchAdminTalents = (filters: AdminTalentFilters = {}) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  )
  return httpClient
    .get<ApiEnvelope<{ users: AdminTalent[]; total: number }>>(
      '/admin/talents',
      {
        params,
      },
    )
    .then((response) => response.data.data)
}

export const deleteAdminTalent = (id: string) =>
  httpClient
    .delete<ApiEnvelope<null>>(`/admin/talents/${id}`)
    .then((response) => response.data)

export const fetchAdminRecruiters = (filters: AdminRecruiterFilters = {}) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  )
  return httpClient
    .get<ApiEnvelope<{ users: AdminRecruiter[]; total: number }>>(
      '/admin/recruiters',
      {
        params,
      },
    )
    .then((response) => response.data.data)
}

export const deleteAdminRecruiter = (id: string) =>
  httpClient
    .delete<ApiEnvelope<null>>(`/admin/recruiters/${id}`)
    .then((response) => response.data)

export const fetchAdminJobs = (filters: AdminJobFilters = {}) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  )
  return httpClient
    .get<ApiEnvelope<{ jobs: AdminJob[]; total: number }>>('/admin/jobs', {
      params,
    })
    .then((response) => response.data.data)
}

export const deleteAdminJob = (id: string) =>
  httpClient
    .delete<ApiEnvelope<null>>(`/admin/jobs/${id}`)
    .then((response) => response.data)

export const fetchAdminOrganizations = (
  filters: AdminOrganizationFilters = {},
) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  )
  return httpClient
    .get<ApiEnvelope<{ organizations: AdminOrganization[]; total: number }>>(
      '/admin/organizations',
      {
        params,
      },
    )
    .then((response) => response.data.data)
}

export const verifyAdminOrganization = (id: string) =>
  httpClient
    .patch<ApiEnvelope<{ organization: AdminOrganization }>>(
      `/admin/organizations/${id}/verify`,
    )
    .then((response) => response.data)

export const rejectAdminOrganization = (id: string) =>
  httpClient
    .patch<ApiEnvelope<{ organization: AdminOrganization }>>(
      `/admin/organizations/${id}/reject`,
    )
    .then((response) => response.data)
