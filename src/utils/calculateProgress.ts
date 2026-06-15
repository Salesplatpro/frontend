import { ProfileFormValues } from '@/features/profile/types'

const PROFILE_FIELDS: (keyof ProfileFormValues)[] = [
  'bio',
  'role',
  'maxSalary',
  'minSalary',
  'experience',
]

export const calculateProgress = (
  values: ProfileFormValues,
  hasCv: boolean,
): number => {
  const filledFields = PROFILE_FIELDS.filter((field) => {
    const value = values[field]
    return Array.isArray(value) ? value.length > 0 : value !== ''
  })
  const totalFields = PROFILE_FIELDS.length + 1

  return ((filledFields.length + (hasCv ? 1 : 0)) / totalFields) * 100
}
