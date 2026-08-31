import { FormikErrors } from 'formik'

import { ProfileFormValues } from '@/features/profile/types'

export const PROFILE_COMPLETION_FIELDS = [
  {
    name: 'bio',
    message: 'Add a short bio so recruiters know who you are.',
  },
  { name: 'role', message: 'Select at least one role.' },
  { name: 'experience', message: 'Select your experience level.' },
  { name: 'workType', message: 'Select at least one work type.' },
  { name: 'location.country.name', message: 'Country is required.' },
  { name: 'minSalary', message: 'Enter your minimum salary.' },
  { name: 'maxSalary', message: 'Enter your maximum salary.' },
  { name: 'cv', message: 'Upload your CV to continue.' },
] as const

export type ProfileCompletionFieldName =
  (typeof PROFILE_COMPLETION_FIELDS)[number]['name']

export const isProfileFieldEmpty = (
  values: ProfileFormValues,
  name: ProfileCompletionFieldName,
  hasCv: boolean,
): boolean => {
  switch (name) {
    case 'bio':
      return !values.bio?.trim()
    case 'role':
      return values.role.length === 0
    case 'experience':
      return !values.experience
    case 'workType':
      return values.workType.length === 0
    case 'location.country.name':
      return !values.location.country.name
    case 'minSalary':
      return !values.minSalary
    case 'maxSalary':
      return !values.maxSalary
    case 'cv':
      return !hasCv
    default:
      return false
  }
}

export const getIncompleteProfileFields = (
  values: ProfileFormValues,
  hasCv: boolean,
) =>
  PROFILE_COMPLETION_FIELDS.filter((field) =>
    isProfileFieldEmpty(values, field.name, hasCv),
  )

const setNestedError = (
  target: Record<string, unknown>,
  path: string,
  message: string,
) => {
  const parts = path.split('.')
  let current = target
  for (let index = 0; index < parts.length - 1; index += 1) {
    const key = parts[index]
    const next = current[key]
    if (typeof next !== 'object' || next === null) {
      current[key] = {}
    }
    current = current[key] as Record<string, unknown>
  }
  current[parts[parts.length - 1]] = message
}

export const getProfileCompletionErrors = (
  values: ProfileFormValues,
  hasCv: boolean,
): {
  errors: FormikErrors<ProfileFormValues>
  cv?: string
} => {
  const errors: Record<string, unknown> = {}
  let cv: string | undefined

  for (const field of getIncompleteProfileFields(values, hasCv)) {
    if (field.name === 'cv') {
      cv = field.message
      continue
    }
    setNestedError(errors, field.name, field.message)
  }

  return {
    errors: errors as FormikErrors<ProfileFormValues>,
    cv,
  }
}

/** Mirrors backend getProfileCompletion so the bar matches what Continue/prescreening require. */
export const calculateProgress = (
  values: ProfileFormValues,
  hasCv: boolean,
): number => {
  const total = PROFILE_COMPLETION_FIELDS.length
  const completed = total - getIncompleteProfileFields(values, hasCv).length
  return Math.round((completed / total) * 100)
}
