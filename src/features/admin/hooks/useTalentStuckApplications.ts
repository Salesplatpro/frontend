import useSWR from 'swr'

import { fetchTalentStuckApplications } from '../services/adminService'

export const talentStuckApplicationsKey = (talentId: string) =>
  `/admin/users/${talentId}/stuck-applications`

export const useTalentStuckApplications = (talentId?: string) => {
  const { data: applications, isLoading } = useSWR(
    talentId ? talentStuckApplicationsKey(talentId) : null,
    () => fetchTalentStuckApplications(talentId!),
  )

  return { applications: applications ?? [], isLoading }
}
