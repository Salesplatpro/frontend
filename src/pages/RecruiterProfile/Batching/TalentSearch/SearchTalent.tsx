import { Alert } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { getRole } from '../../../../api/api-communication'
import Location from '../../../../components/global/Location'

type RoleType = {
  _id: string
  name: string
  description: string
}

const SearchTalent = () => {
  const navigate = useNavigate()
  const scoutJobId = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [fetchedRoles, setFetchedRoles] = useState<RoleType[]>([])
  const [error, setError] = useState<string | null>(null)
  console.log(scoutJobId.id, 'search')
  // Initialize form values from URL params
  const initialSearchValues = {
    scoutJobId: searchParams.get('scoutJobId') || scoutJobId.id,
    // scoutJobId: '66e80ed27554c2d493122a67',
    role: searchParams.get('role') || '',
    description: searchParams.get('description') || '',
    location: {
      country: {
        name: searchParams.get('countryName') || '',
        geoId: searchParams.get('geoId') || null,
      },
    },
    experienceLevel: searchParams.get('experienceLevel') || '',
  }

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRole()
        setFetchedRoles(response.data)
      } catch (err) {
        console.error('Error fetching roles:', err)
        setError('Error fetching roles')
      }
    }
    fetchRoles()
  }, [])

  const handleRoleChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setFieldValue: (field: string, value: any) => void,
  ) => {
    const selectedRoleId = e.target.value
    setFieldValue('role', selectedRoleId)

    const selectedRole = fetchedRoles.find(
      (role) => role._id === selectedRoleId,
    )
    if (selectedRole) {
      setFieldValue('description', selectedRole.description)
    }
  }

  const onSubmit = async (values: any) => {
    const { scoutJobId, role, description, location, experienceLevel } = values

    // Set search parameters in URL
    setSearchParams({
      scoutJobId,
      role,
      description,
      countryName: location.country.name,
      geoId: location.country.geoId,
      experienceLevel,
    })

    // Navigate to the results page
    const queryParams = new URLSearchParams({
      scoutJobId,
      role,
      description,
      countryName: location.country.name,
      geoId: location.country.geoId,
      experienceLevel,
    }).toString()

    navigate(`/recruiterDashboard/scout/search-results?${queryParams}`)
  }

  return (
    <div className="py-4 space-y-4">
      <div className="space-y-2">
        <h1 className="font-raleway text-[#101828] text-[32px] font-bold leading-[37.57px]">
          Filter Talent Search
        </h1>
        <p className="font-raleway font-normal text-[20px] leading-[23.48px] text-[#101828]">
          Find qualified talents by searching
        </p>
      </div>
      {error && <Alert severity="error">{error} </Alert>}
      <div className="flex justify-center items-center mx-auto w-full ">
        <Formik initialValues={initialSearchValues} onSubmit={onSubmit}>
          {({ setFieldValue, values }) => (
            <Form className="lg:flex lg:flex-col lg:justify-start lg:items-start lg:w-[700px] md:w-[600px] md:flex md:flex-col md:justify-start md: items-start sm:w-[550px] h-[550px] w-[300px] rounded-2xl mt-10 space-y-3">
              <div>
                <label
                  htmlFor="role"
                  className="text-[#434144] font-raleway font-bold leading-4 text-[14px]">
                  Job Title
                </label>
                <Field
                  as="select"
                  name="role"
                  className="w-[320px] lg:w-[674px] h-[54px] md:w-[550px] sm:w-[490px] border border-[#D0D5DD] rounded-lg pl-3 mt-2"
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleRoleChange(e, setFieldValue)
                  }>
                  <option value="" label="Select a role" />
                  {fetchedRoles.map((role: RoleType) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </Field>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="text-[#434144] font-raleway font-bold leading-4 text-[14px]">
                  Description
                </label>
                <Field
                  name="description"
                  type="text"
                  className="w-[320px] flex flex-col lg:w-[674px] h-[54px] md:w-[550px] sm:w-[490px] border border-[#D0D5DD] rounded-lg pl-3 mt-2"
                  placeholder="Add Job description here"
                  value={values.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue('description', e.target.value)
                  }
                />
              </div>

              <div className="w-[320px] lg:w-[674px] md:w-[550px] sm:w-[490px]">
                <Location
                  locationTitle="Country"
                  geoId={values.location.country.geoId}
                  isCountry={true}
                  onChange={(geoId) => {
                    setFieldValue('location.country.geoId', geoId)
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
                  className="w-full p-2 border border-gray-300 rounded-lg py-5 mt-2">
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
