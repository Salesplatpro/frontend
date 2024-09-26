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
  isCountry,
  onChange,
}) => {
  const { setFieldValue } = useFormikContext()
  const [options, setOptions] = useState<LocationOption[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res
        if (isCountry) {
          res = await geonames.countryInfo({})
          setOptions(
            res.geonames.map((country: any) => ({
              name: country.countryName,
              geoId: country.geonameId,
              countryName: country.countryName,
            })),
          )
        } else if (geoId) {
          res = await geonames.children({ geonameId: geoId })
          setOptions(
            res.geonames.map((place: any) => ({
              name: place.name,
              geoId: place.geonameId,
            })),
          )
        } else {
          setOptions([])
        }
      } catch (err) {
        console.error(
          `Error fetching ${isCountry ? 'countries' : 'states/cities'}:`,
          err,
        )
      }
    }

    fetchData()
  }, [geoId, isCountry])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = options.find(
      (option) => option.geoId === parseInt(e.target.value, 10),
    )
    if (selectedOption) {
      const value = {
        name: isCountry ? selectedOption.countryName : selectedOption.name,
        geoId: selectedOption.geoId,
      }
      setFieldValue(`location.${locationTitle.toLowerCase()}`, value)
      onChange(value.geoId)
    }
  }

  return (
    <div className="">
      <label
        className="font-bold text-[14px] text-[#434144]"
        htmlFor={locationTitle}>
        {locationTitle}
      </label>
      <select
        id={locationTitle}
        name={locationTitle.toLowerCase()}
        onChange={handleChange}
        className="border border-[#D0D5DD] p-4 rounded-lg w-full">
        <option value="">Select a {locationTitle.toLowerCase()}...</option>
        {options.map((option) => (
          <option key={option.geoId} value={option.geoId}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Location
