import { useFormikContext } from 'formik'
import Geonames from 'geonames.js'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'

import { LocationOption, LocationProps } from '../../utils/jobPostTypes'

const geonames = new Geonames({
  username: 'timmydee',
  lan: 'en',
  encoding: 'JSON',
})

const Location: React.FC<LocationProps> = ({
  locationTitle,
  locationLabel,
  geoId,
  selectedName,
  isCountry,
  onChange,
  height,
  bold,
  asterick,
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
    if (options.length && typeof selectedName === 'string') {
      const matchedOption = options.find((place) => {
        const placeName = place.name
        return (
          placeName.trim().toLowerCase() === selectedName.trim().toLowerCase()
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

  const handleChange = (newValue: any) => {
    const selectedOption = options.find(
      (option) => option.geoId === parseInt(newValue.value, 10),
    )
    if (selectedOption) {
      const value = {
        name: isCountry ? selectedOption.countryName : selectedOption.name,
        geoId: selectedOption.geoId,
      }
      setSelectedValue(selectedOption.geoId.toString())
      setFieldValue(`location.${locationTitle?.toLowerCase()}`, value)
      onChange(value.geoId)
    }
  }

  const selectOptions = options.map((option) => ({
    value: option.geoId.toString(),
    label: option.name,
  }))

  const customStyles = {
    control: (base: any) => ({
      ...base,
      borderColor: '#D0D5DD',
      height: height ? `${height}` : '44px',
      fontFamily: 'Raleway',
    }),
    input: (base: any) => ({
      ...base,
      color: '#333333',
      fontSize: '16px',
    }),
  }

  return (
    <div className="">
      <label
        className={`text-[16px] text-[#344054] font-raleway pb-2 ${
          bold ? 'font-bold' : 'font-medium'
        }`}
        htmlFor={locationTitle}>
        {locationLabel}
        {asterick && <span className="text-red-500 ml-1">*</span>}
      </label>

      {isLoading ? (
        <div className="text-sm text-gray-500 mt-2">
          Loading {locationTitle}...
        </div>
      ) : fetchError ? (
        <div className="text-sm text-red-500 mt-2">{fetchError}</div>
      ) : (
        <div className="relative w-full mt-1">
          <Select
            id={locationTitle}
            name={locationTitle?.toLowerCase()}
            onChange={handleChange}
            value={
              selectOptions.find((option) => option.value === selectedValue) ||
              ''
            }
            styles={customStyles}
            options={selectOptions}
            placeholder={`Select a ${locationTitle?.toLowerCase()}...`}
            isSearchable={true}
          />
        </div>
      )}
    </div>
  )
}

export default Location
