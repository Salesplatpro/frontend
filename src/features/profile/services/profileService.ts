import { AxiosProgressEvent } from 'axios'

import { httpClient } from '@/features/auth/services/httpClient'

import {
  ProfileApiResponse,
  ProfilePatchPayload,
  UploadResponse,
} from '../types'

export const PROFILE_ENDPOINT = '/user/me'

export const fetchProfile = () =>
  httpClient
    .get<ProfileApiResponse>(PROFILE_ENDPOINT)
    .then((response) => response.data)

export const patchProfile = (payload: Partial<ProfilePatchPayload>) =>
  httpClient
    .patch<ProfileApiResponse>(PROFILE_ENDPOINT, payload)
    .then((response) => response.data)

export const uploadFile = (
  file: File,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
) => {
  const formData = new FormData()
  formData.append('file', file)

  return httpClient
    .post<UploadResponse>('/uploads', formData, { onUploadProgress })
    .then((response) => response.data)
}
