import React, { useEffect, useState } from 'react'
import Geonames from 'geonames.js'
import { useFormikContext } from 'formik'
import { LocationProps, LocationOption } from '../../utils/jobPostTypes'

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
        if (isCountry) {
          const res = await geonames.countryInfo({})
          setOptions(
            res.geonames.map((country: any) => ({
              name: country.countryName,
              geoId: country.geonameId,
              countryName: country.countryName,
            })),
          )
        } else if (geoId) {
          const res = await geonames.children({ geonameId: geoId })
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
    const value = {
      name: isCountry ? selectedOption!.countryName : selectedOption!.name,
      geoId: selectedOption!.geoId,
    }
    setFieldValue(`location.${locationTitle.toLowerCase()}`, value)
    onChange(value.geoId)
  }

  return (
    <div className="mb-4">
      <label className="block mb-2 font-bold" htmlFor={locationTitle}>
        {locationTitle}
      </label>
      <select
        id={locationTitle}
        name={locationTitle.toLowerCase()}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded">
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
