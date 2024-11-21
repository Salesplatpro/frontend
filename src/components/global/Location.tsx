import { useFormikContext } from 'formik'
import Geonames from 'geonames.js'
import React, { useEffect, useState } from 'react'

import { LocationOption, LocationProps } from '../../utils/jobPostTypes'

const geonames = new Geonames({
  username: 'timmydee',
  lan: 'en',
  encoding: 'JSON',
})

const Location: React.FC<LocationProps> = ({
  locationTitle,
  geoId,
  selectedName,
  isCountry,
  onChange,
  height,
  bold,
}) => {
  const { setFieldValue } = useFormikContext()
  const [options, setOptions] = useState<LocationOption[]>([])
  const [selectedValue, setSelectedValue] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setFetchError(null)

      try {
        let res
        if (isCountry) {
          res = await geonames.countryInfo({})
          if (res && res.geonames) {
            setOptions(
              res.geonames.map((country: any) => ({
                name: country.countryName,
                geoId: country.geonameId,
                countryName: country.countryName,
              })),
            )
          }
        } else if (geoId) {
          res = await geonames.children({ geonameId: geoId })
          if (res && res.geonames) {
            setOptions(
              res.geonames.map((place: any) => ({
                name: place.capital || place.name,
                geoId: place.geonameId,
              })),
            )
          }
        } else {
          setOptions([])
        }
      } catch (err) {
        setFetchError(
          `Error fetching ${isCountry ? 'countries' : 'states/cities'}`,
        )
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (geoId || isCountry) {
      fetchData()
    }
  }, [geoId, isCountry])

  // After options are set, check if the selectedName exists and matches
  useEffect(() => {
    if (options.length && selectedName) {
      const matchedOption = options.find((place) => {
        const placeName = place.name
        return (
          placeName?.trim().toLowerCase() === selectedName.trim().toLowerCase()
        )
      })

      if (matchedOption) {
        setSelectedValue(matchedOption.geoId.toString())
        setFieldValue(`location.${locationTitle?.toLowerCase()}`, {
          name: matchedOption.name,
          geoId: matchedOption.geoId,
        })
      }
    }
  }, [options, selectedName, setFieldValue, locationTitle])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = options.find(
      (option) => option.geoId === parseInt(e.target.value, 10),
    )
    if (selectedOption) {
      const value = {
        name: isCountry ? selectedOption.countryName : selectedOption.name,
        geoId: selectedOption.geoId,
      }
      setSelectedValue(selectedOption.geoId.toString())
      setFieldValue(`location.${locationTitle?.toLowerCase()}`, value)
      onChange(value.geoId) // Notify parent component of the geoId change
    }
  }

  return (
    <div className="">
      <label
        className={`text-[14px] text-[#344054] ${
          bold ? 'font-bold' : 'font-medium'
        }`}
        htmlFor={locationTitle}>
        {locationTitle}
      </label>

      {isLoading ? (
        <div className="text-sm text-gray-500 mt-2">
          Loading {locationTitle}...
        </div>
      ) : fetchError ? (
        <div className="text-sm text-red-500 mt-2">{fetchError}</div>
      ) : (
        <select
          id={locationTitle}
          name={locationTitle?.toLowerCase()}
          onChange={handleChange}
          value={selectedValue || ''}
          className={`border border-[#D0D5DD] px-2 mt-1 rounded-lg w-full font-raleway ${
            height ? `h-[${height}]` : 'h-[44px]'
          }`}>
          <option value="">Select a {locationTitle?.toLowerCase()}...</option>
          {options.map((option) => (
            <option key={option.geoId} value={option.geoId}>
              {option.name}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}

export default Location
