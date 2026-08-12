import { httpClient } from '@/features/auth/services/httpClient'

export const getTalentHasEmbedding = (talentId: string) =>
  httpClient
    .get<{ data: { user: { hasEmbedding: boolean } } }>(
      `/user/profile/${talentId}`,
    )
    .then((response) => response.data.data.user.hasEmbedding)

export const reprocessCv = (talentId: string) =>
  httpClient.post(`/user/profile/${talentId}/reprocess-cv`)
