import React from 'react'

import { Select } from '../Select'
import styles from './LocationSelect.module.scss'
import { LocationFormValue } from './types'
import {
  EMPTY_LOCATION_VALUE,
  getCityOptions,
  getCountryOptions,
  getStateOptions,
} from './useLocationSelect'

interface LocationSelectErrors {
  country?: string
  state?: string
  city?: string
}

interface LocationSelectProps {
  value: LocationFormValue
  onChange: (value: LocationFormValue) => void
  countryLabel?: string
  stateLabel?: string
  cityLabel?: string
  countryRequired?: boolean
  stateRequired?: boolean
  cityRequired?: boolean
  height?: string
  errors?: LocationSelectErrors
}

export const LocationSelect: React.FC<LocationSelectProps> = ({
  value,
  onChange,
  countryLabel = 'Country',
  stateLabel = 'State/Province',
  cityLabel = 'Region/City',
  countryRequired,
  stateRequired,
  cityRequired,
  height,
  errors,
}) => {
  const countryOptions = getCountryOptions()
  const stateOptions = getStateOptions(value.country.isoCode)
  const cityOptions = getCityOptions(value.country.isoCode, value.state.isoCode)

  const handleCountryChange = (isoCode: string) => {
    const option = countryOptions.find((item) => item.value === isoCode)
    onChange({
      country: { name: option?.label || '', isoCode },
      state: { ...EMPTY_LOCATION_VALUE },
      city: { ...EMPTY_LOCATION_VALUE },
    })
  }

  const handleStateChange = (isoCode: string) => {
    const option = stateOptions.find((item) => item.value === isoCode)
    onChange({
      ...value,
      state: { name: option?.label || '', isoCode },
      city: { ...EMPTY_LOCATION_VALUE },
    })
  }

  const handleCityChange = (name: string) => {
    onChange({ ...value, city: { name, isoCode: '' } })
  }

  return (
    <div className={styles.row}>
      <div className={styles.field}>
        <Select
          name="location.country.name"
          label={countryLabel}
          required={countryRequired}
          value={value.country.isoCode || null}
          onChange={handleCountryChange}
          options={countryOptions}
          placeholder="Select a country"
          searchable
          height={height}
          error={errors?.country}
        />
      </div>
      <div className={styles.field}>
        <Select
          name="location.state.name"
          label={stateLabel}
          required={stateRequired}
          value={value.state.isoCode || null}
          onChange={handleStateChange}
          options={stateOptions}
          placeholder="Select a state"
          searchable
          disabled={!value.country.isoCode}
          height={height}
          error={errors?.state}
        />
      </div>
      <div className={styles.field}>
        <Select
          name="location.city.name"
          label={cityLabel}
          required={cityRequired}
          value={value.city.name || null}
          onChange={handleCityChange}
          options={cityOptions}
          placeholder="Select a city"
          searchable
          disabled={!value.state.isoCode}
          height={height}
          error={errors?.city}
        />
      </div>
    </div>
  )
}
