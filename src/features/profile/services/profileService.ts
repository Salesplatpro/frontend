import { AxiosProgressEvent } from 'axios'

import { httpClient } from '@/features/auth/services/httpClient'

import { ProfileApiResponse, ProfilePatchPayload } from '../types'

export const PROFILE_ENDPOINT = '/user/me'
// Distinct from PROFILE_ENDPOINT: accepts a multipart `cv` file, which runs
// through the backend's text-extraction/embedding pipeline (required for the
// personalized test feature). Talent-only.
const CV_UPLOAD_ENDPOINT = '/user/profile'

export const fetchProfile = () =>
  httpClient
    .get<ProfileApiResponse>(PROFILE_ENDPOINT)
    .then((response) => response.data)

export const patchProfile = (payload: Partial<ProfilePatchPayload>) =>
  httpClient
    .patch<ProfileApiResponse>(PROFILE_ENDPOINT, payload)
    .then((response) => response.data)

export const uploadCv = (
  file: File,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
) => {
  const formData = new FormData()
  formData.append('cv', file)

  return httpClient
    .patch<ProfileApiResponse>(CV_UPLOAD_ENDPOINT, formData, {
      onUploadProgress,
    })
    .then((response) => response.data)
}
