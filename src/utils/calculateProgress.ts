import { ProfileFormValues } from '@/features/profile/types'

/** Mirrors backend getProfileCompletion so the bar matches what Continue/prescreening require. */
export const calculateProgress = (
  values: ProfileFormValues,
  hasCv: boolean,
): number => {
  const fields = [
    !!values.bio,
    hasCv,
    values.workType.length > 0,
    !!values.location.country.name,
    !!values.experience,
    !!(values.maxSalary && values.minSalary),
    values.role.length > 0,
  ]
  const completed = fields.filter(Boolean).length
  return Math.round((completed / fields.length) * 100)
}
