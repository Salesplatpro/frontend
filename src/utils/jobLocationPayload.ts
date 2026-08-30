import {
  type WorkType,
  workModeNeedsLocation,
} from '@/components/features/jobs/WorkTypeCheckboxes'
import { LocationFormValue } from '@/components/forms/LocationSelect'

export const locationFieldsFromWorkMode = (
  location: LocationFormValue,
  workMode: WorkType[],
): {
  locationCountry: string | null
  locationState?: string | null
  locationCity?: string | null
} => {
  if (!workModeNeedsLocation(workMode)) {
    return {
      locationCountry: null,
      locationState: null,
      locationCity: null,
    }
  }

  return {
    locationCountry: location.country.name,
    ...(location.state.name ? { locationState: location.state.name } : {}),
    ...(location.city.name ? { locationCity: location.city.name } : {}),
  }
}
