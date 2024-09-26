import { Field, Form, Formik } from 'formik'
import React from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import Location from '../../../../components/global/Location'
import { PageHeaderTitle } from '../../../../components/PageHeaderTitle'
import AllRoles from '../../../../components/Roles/AllRoles'

const SearchTalent = () => {
  const navigate = useNavigate()
  const scoutJobId = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  // Initialize form values from URL params
  const initialSearchValues = {
    scoutJobId: searchParams.get('scoutJobId') || scoutJobId.id,
    role: searchParams.get('role') || '',
    location: {
      country: {
        name: searchParams.get('countryName') || '',
        geoId: searchParams.get('geoId') || null,
      },
      state: {
        name: searchParams.get('stateName') || '',
        geoId: searchParams.get('geoId') || null,
      },
      city: {
        name: searchParams.get('cityName') || '',
      },
    },
    experienceLevel: searchParams.get('experienceLevel') || '',
  }

  const onSubmit = async (values: any) => {
    const { scoutJobId, role, location, experienceLevel } = values

    // Set search parameters in URL
    setSearchParams({
      scoutJobId,
      role,
      countryName: location.country.name,
      countryGeoId: location.country.geoId,
      stateName: location.state.name,
      stateGeoId: location.state.geoId,
      cityName: location.city.name,
      cityGeoId: location.city.geoId,
      experienceLevel,
    })

    // Navigate to the results page
    const queryParams = new URLSearchParams({
      scoutJobId,
      role,
      countryName: location.country.name,
      geoId: location.country.geoId,
      stateName: location.state.name,
      stateGeoId: location.state.geoId,
      cityName: location.city.name,
      cityGeoId: location.city.geoId,
      experienceLevel,
    }).toString()

    navigate(`/recruiterDashboard/scout/search-results?${queryParams}`)
  }

  return (
    <div className="py-4 space-y-4">
      <PageHeaderTitle
        paramsId={scoutJobId}
        description="Find qualified talents by searching"
      />
      <div className="flex justify-center items-center mx-auto md:w-[60%] w-full ">
        <Formik initialValues={initialSearchValues} onSubmit={onSubmit}>
          {({ setFieldValue, values }) => (
            <Form className="lg:flex lg:flex-col lg:justify-start lg:items-start lg:w-[700px] md:w-[600px] md:flex md:flex-col md:justify-start md: items-start sm:w-[550px] h-[550px] w-[300px] rounded-2xl mt-10 space-y-3">
              <div>
                <label
                  htmlFor="role"
                  className="text-[#434144] font-raleway font-bold leading-4 text-[14px]">
                  Job Title
                </label>
                <div className="border border-[#D0D5DD] py-4 pl-4 rounded-lg w-[320px] lg:w-[674px] md:w-[550px] sm:w-[490px]">
                  <AllRoles
                    name="role"
                    value={values.role}
                    onChange={(e) => setFieldValue('role', e.target.value)}
                  />
                </div>
              </div>

              <div className="w-[320px] lg:w-[674px] md:w-[550px] sm:w-[490px]">
                <Location
                  locationTitle="Country"
                  geoId={values.location.country.geoId}
                  isCountry={true}
                  onChange={(geoId) => {
                    setFieldValue('location.country.geoId', geoId)
                    setFieldValue('location.state', { name: '', geoId: null })
                    setFieldValue('location.city', { name: '', geoId: null })
                  }}
                />
              </div>
              <div className="w-[320px] lg:w-[674px] md:w-[550px] sm:w-[490px]">
                <Location
                  locationTitle="State"
                  geoId={values.location.country.geoId}
                  isCountry={false}
                  onChange={(geoId) => {
                    setFieldValue('location.state.geoId', geoId)
                    setFieldValue('location.city', { name: '', geoId: null })
                  }}
                />
              </div>
              <div className="w-[320px] lg:w-[674px] md:w-[550px] sm:w-[490px]">
                <Location
                  locationTitle="City"
                  geoId={values.location.state.geoId}
                  isCountry={false}
                  onChange={(geoId) => {
                    setFieldValue('location.city.geoId', geoId)
                  }}
                />
              </div>

              <div className="mb-4 w-[320px] lg:w-[674px] md:w-[550px] sm:w-[490px]">
                <label
                  className="text-[#434144] font-raleway font-bold leading-4 text-[14px]"
                  htmlFor="experienceLevel">
                  Experience Level
                </label>
                <Field
                  as="select"
                  id="experienceLevel"
                  name="experienceLevel"
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg py-4">
                  <option value="">Select Experience Level</option>
                  <option value="senior">Senior</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="junior">Junior</option>
                </Field>
              </div>
              <button
                type="submit"
                className="flex justify-center items-center w-[270px] lg:w-[358px] md:w-[300px] sm:w-[320px] rounded-lg bg-[#3c6fd4] hover:bg-[#4b82e1] py-3 mt-8 mx-auto">
                <p className="text-white font-semibold font-raleway leading-[24px] text-[17px]">
                  Search
                </p>
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default SearchTalent
