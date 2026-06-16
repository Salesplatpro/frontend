import { City, Country, State } from 'country-state-city'

import { SelectOption } from '../Select/types'
import { LocationFormValue, LocationValue } from './types'

export const EMPTY_LOCATION_VALUE: LocationValue = { name: '', isoCode: '' }

export const EMPTY_LOCATION: LocationFormValue = {
  country: { ...EMPTY_LOCATION_VALUE },
  state: { ...EMPTY_LOCATION_VALUE },
  city: { ...EMPTY_LOCATION_VALUE },
}

export const getCountryOptions = (): SelectOption[] =>
  Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }))

export const getStateOptions = (countryIsoCode?: string): SelectOption[] => {
  if (!countryIsoCode) return []
  return State.getStatesOfCountry(countryIsoCode).map((state) => ({
    value: state.isoCode,
    label: state.name,
  }))
}

export const getCityOptions = (
  countryIsoCode?: string,
  stateIsoCode?: string,
): SelectOption[] => {
  if (!countryIsoCode || !stateIsoCode) return []
  return City.getCitiesOfState(countryIsoCode, stateIsoCode).map((city) => ({
    value: city.name,
    label: city.name,
  }))
}

const findByName = <T extends { name: string }>(
  items: T[],
  name: string,
): T | undefined =>
  items.find((item) => item.name.toLowerCase() === name.trim().toLowerCase())

/**
 * Back-resolves plain location names (as stored on jobs/profiles) into
 * {name, isoCode} values the LocationSelect can drive.
 */
export const resolveLocationFromNames = (
  country?: string,
  state?: string,
  city?: string,
): LocationFormValue => {
  if (!country) return { ...EMPTY_LOCATION }

  const countryMatch = findByName(Country.getAllCountries(), country)
  if (!countryMatch) return { ...EMPTY_LOCATION }

  const countryValue: LocationValue = {
    name: countryMatch.name,
    isoCode: countryMatch.isoCode,
  }

  let stateValue: LocationValue = { ...EMPTY_LOCATION_VALUE }
  if (state) {
    const stateMatch = findByName(
      State.getStatesOfCountry(countryMatch.isoCode),
      state,
    )
    if (stateMatch) {
      stateValue = { name: stateMatch.name, isoCode: stateMatch.isoCode }
    }
  }

  let cityValue: LocationValue = { ...EMPTY_LOCATION_VALUE }
  if (city && stateValue.isoCode) {
    const cityMatch = findByName(
      City.getCitiesOfState(countryMatch.isoCode, stateValue.isoCode),
      city,
    )
    if (cityMatch) {
      cityValue = { name: cityMatch.name, isoCode: '' }
    }
  }

  return { country: countryValue, state: stateValue, city: cityValue }
}
