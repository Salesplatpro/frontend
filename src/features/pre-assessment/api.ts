import { httpClient } from '@/features/auth/services/httpClient'

import { PRESCREENING_ENDPOINT } from './constants'
import { ApiResponse, Assessment, SubmitPayload } from './types'

export const fetchAssessment = () =>
  httpClient
    .get<ApiResponse<{ preScreening: Assessment }>>(PRESCREENING_ENDPOINT)
    .then((res) => res.data)

export const submitAssessment = (payload: SubmitPayload) =>
  httpClient
    .post<ApiResponse<Assessment>>(`${PRESCREENING_ENDPOINT}/submit`, payload)
    .then((res) => res.data)

export const retakeAssessment = () =>
  httpClient
    .post<ApiResponse<Assessment>>(`${PRESCREENING_ENDPOINT}/retake`, {})
    .then((res) => res.data)
