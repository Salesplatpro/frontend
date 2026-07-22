import cn from 'classnames'
import React, { useState } from 'react'

import type { LocationFormValue } from '@/components/forms/LocationSelect'
import {
  EMPTY_LOCATION_VALUE,
  getCityOptions,
  getCountryOptions,
  getStateOptions,
} from '@/components/forms/LocationSelect/useLocationSelect'
import { Select } from '@/components/forms/Select'

import styles from './LocationTabsSelect.module.scss'

type LocationTier = 'country' | 'state' | 'city'

interface LocationTabsSelectProps {
  value: LocationFormValue
  onChange: (value: LocationFormValue) => void
}

const TABS: { key: LocationTier; label: string }[] = [
  { key: 'country', label: 'Country' },
  { key: 'state', label: 'State/Province' },
  { key: 'city', label: 'Region/City' },
]

export const LocationTabsSelect: React.FC<LocationTabsSelectProps> = ({
  value,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState<LocationTier>('country')

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
    <div className={styles.wrapper}>
      <div className={styles.tabRow} role="tablist" aria-label="Location tier">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            className={cn(
              styles.tab,
              activeTab === tab.key && styles.tabActive,
            )}
            onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'country' && (
        <Select
          value={value.country.isoCode || null}
          onChange={handleCountryChange}
          options={countryOptions}
          placeholder="Select country..."
          searchable
        />
      )}
      {activeTab === 'state' && (
        <Select
          value={value.state.isoCode || null}
          onChange={handleStateChange}
          options={stateOptions}
          placeholder="Select state..."
          searchable
          disabled={!value.country.isoCode}
        />
      )}
      {activeTab === 'city' && (
        <Select
          value={value.city.name || null}
          onChange={handleCityChange}
          options={cityOptions}
          placeholder="Select city..."
          searchable
          disabled={!value.state.isoCode}
        />
      )}
    </div>
  )
}
