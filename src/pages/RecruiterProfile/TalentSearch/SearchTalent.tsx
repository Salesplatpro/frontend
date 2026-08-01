import { Form, Formik } from 'formik'
import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  LocationSelect,
  resolveLocationFromNames,
} from '@/components/forms/LocationSelect'
import { RoleSelect } from '@/components/forms/Roles/RoleSelect'
import { EXPERIENCE_LEVEL_OPTIONS, Select } from '@/components/forms/Select'
import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'

const SearchTalent = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Initialize form values from URL params
  const initialSearchValues = {
    role: searchParams.get('role') || '',
    location: resolveLocationFromNames(
      searchParams.get('countryName') || undefined,
      searchParams.get('stateName') || undefined,
      searchParams.get('cityName') || undefined,
    ),
    experienceLevel: searchParams.get('experienceLevel') || '',
  }

  const onSubmit = async (values: typeof initialSearchValues) => {
    const { role, location, experienceLevel } = values

    const locationParams = {
      countryName: location.country.name,
      stateName: location.state.name,
      cityName: location.city.name,
    }

    // Set search parameters in URL
    setSearchParams({
      role,
      ...locationParams,
      experienceLevel,
    })

    // Navigate to the results page
    const queryParams = new URLSearchParams({
      role,
      ...locationParams,
      experienceLevel,
    }).toString()

    navigate(`/recruiterDashboard/talent-search/results?${queryParams}`)
  }

  return (
    <div className="py-4 space-y-4">
      <PageHeaderTitle
        title="Talent Search"
        description="Find qualified talents by searching"
        onBack={() => navigate(-1)}
      />
      <div className="flex justify-center items-center mx-auto md:w-[60%] w-full ">
        <Formik initialValues={initialSearchValues} onSubmit={onSubmit}>
          {({ setFieldValue, values }) => (
            <Form className="lg:flex lg:flex-col lg:justify-start lg:items-start lg:w-[700px] md:w-[600px] md:flex md:flex-col md:justify-start md: items-start sm:w-[550px] h-[550px] w-[300px] rounded-2xl mt-10 space-y-3">
              <div className="w-[320px] lg:w-[674px] md:w-[550px] sm:w-[490px]">
                <RoleSelect
                  label="Job Title"
                  name="role"
                  value={values.role}
                  onChange={(value) => setFieldValue('role', value)}
                  creatable={false}
                />
              </div>

              <div className="w-[320px] lg:w-[674px] md:w-[550px] sm:w-[490px]">
                <LocationSelect
                  value={values.location}
                  onChange={(location) => setFieldValue('location', location)}
                  cityLabel="Region"
                />
              </div>

              <div className="mb-4 w-[320px] lg:w-[674px] md:w-[550px] sm:w-[490px]">
                <Select
                  label="Experience Level"
                  options={EXPERIENCE_LEVEL_OPTIONS}
                  value={values.experienceLevel}
                  onChange={(value) => setFieldValue('experienceLevel', value)}
                  placeholder="Select Experience Level"
                />
              </div>
              <button
                type="submit"
                className="flex justify-center items-center w-[270px] lg:w-[358px] md:w-[300px] sm:w-[320px] rounded-lg bg-primary-strong hover:bg-[#4b82e1] py-3 mt-8 mx-auto">
                <p className="text-white font-semibold font-raleway leading-[24px] text-lg">
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
