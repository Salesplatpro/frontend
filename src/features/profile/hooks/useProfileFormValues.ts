import {
  EMPTY_LOCATION,
  resolveLocationFromNames,
} from '@/components/forms/LocationSelect'

import { ProfileFormValues, ProfileUser } from '../types'

export const buildProfileFormValues = (
  user?: ProfileUser | null,
): ProfileFormValues => {
  const formValues = {
    bio: user?.bio || '',
    role: user?.userRoles?.map((role) => role.id) || [],
    phone: user?.phone || '',
    location:
      user?.locationCountry || user?.locationState || user?.locationCity
        ? resolveLocationFromNames(
            user?.locationCountry ?? undefined,
            user?.locationState ?? undefined,
            user?.locationCity ?? undefined,
          )
        : { ...EMPTY_LOCATION },
    experience: user?.experience || '',
    minSalary: user?.minSalary != null ? String(user.minSalary) : '',
    maxSalary: user?.maxSalary != null ? String(user.maxSalary) : '',
    currency: user?.currency || '',
    compensationPeriod: user?.compensationPeriod || '',
    workType: user?.workType || [],
  }

  return formValues
}
