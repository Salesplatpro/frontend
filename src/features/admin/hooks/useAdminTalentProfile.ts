import useSWR from 'swr'

import { fetchAdminTalentProfile } from '../services/adminService'

export const adminTalentProfileKey = (talentId: string) =>
  `/user/profile/${talentId}`

export const useAdminTalentProfile = (talentId?: string) => {
  const { data: talent, isLoading } = useSWR(
    talentId ? adminTalentProfileKey(talentId) : null,
    () => fetchAdminTalentProfile(talentId!),
  )

  return { talent, isLoading }
}
