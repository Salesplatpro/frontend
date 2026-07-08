import {
  EMPTY_LOCATION,
  resolveLocationFromNames,
} from '@/components/forms/LocationSelect'

import { ProfileFormValues, ProfileUser } from '../types'

export const buildProfileFormValues = (
  user?: ProfileUser | null,
): ProfileFormValues => {
  const profile = user?.profile

  return {
    bio: profile?.bio || '',
    role: profile?.role?.map((role) => role._id) || [],
    phone: user?.phone || '',
    location: profile?.location
      ? resolveLocationFromNames(
          profile.location.country,
          profile.location.state,
          profile.location.city,
        )
      : { ...EMPTY_LOCATION },
    experience: profile?.experience || '',
    minSalary: profile?.minSalary != null ? String(profile.minSalary) : '',
    maxSalary: profile?.maxSalary != null ? String(profile.maxSalary) : '',
    currency: profile?.currency || '',
    workType: profile?.workType || [],
  }
}
