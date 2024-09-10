import { Alert } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { getRole } from '../../../../api/api-communication'
import { useSearchTalentDbQuery } from '../../../../redux/api/recruiter'
import Location from '../../../../components/global/Location'
import Loading from '../../../../components/Loading/Loading'

type RoleType = {
  _id: string
  name: string
  description: string
}

const SearchTalent = () => {
  // const navigate = useNavigate()

  const [searchParams, setSearchParams] = useState<any | null>(null)
  const [fetchedRoles, setFetchedRoles] = useState<RoleType[]>([])
  const [roleDescription, setRoleDescription] = useState('')
  const [error, setError] = useState<string | null>(null) // State for error

  const {
    data,
    isLoading,
    error: talentDbError,
  } = useSearchTalentDbQuery(searchParams, { skip: !searchParams })

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
      setRoleDescription(selectedRole.description)
      setFieldValue('description', selectedRole.description)
    }
  }

  const onSubmit = async (values: any) => {
    console.log(values)
    try {
      setSearchParams(values)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="py-4 space-y-4">
      <div className="space-y-2">
        <h1 className="font-raleway text-[#101828] text-[32px] font-bold leading-[37.57px]">
          Filter Talent Search
        </h1>
        <p className="font-raleway font-normal text-[20px] leading-[23.48px] text-[#101828]">
          find qualified talents by searching
        </p>
      </div>
      {error && <Alert severity="error">{error} </Alert>}
      <div className="flex justify-center items-center mx-auto w-full ">
        <Formik
          initialValues={{
            role: '',
            description: '',
            location: {
              country: { name: '', geoId: null },
            },
            experienceLevel: '',
          }}
          onSubmit={onSubmit}>
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
                  value={roleDescription}
                />
              </div>

              <div className="w-[320px] lg:w-[674px] md:w-[550px] sm:w-[490px]">
                <Location
                  locationTitle="Country"
                  geoId={null}
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
                className="flex justify-center items-center w-[270px] lg:w-[358px] md:w-[300px] sm:w-[320px] rounded-lg bg-[#3c6fd4] hover:bg-[#4b82e1] py-3 mt-8 mx-auto"
                disabled={isLoading}>
                <p className="text-white font-semibold font-raleway leading-[24px] text-[17px]">
                  {isLoading ? 'Submitting...' : 'Create'}
                </p>
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <div>
        {isLoading && <Loading />}
        {data && (
          <div>
            {data?.data.talents.map((talent: any) => (
              <div
                key={talent.id}
                className="flex border w-full items-center p-4 rounded-lg">
                <div className="flex-1">
                  <h2 className="text-[#0D0C22] font-semibold">
                    {talent.firstName} {talent.lastName}
                  </h2>
                  <h2 className="text-[#0D0C22] text-sm">
                    {talent.profile.experience}
                  </h2>
                  <h2 className="text-black">{talent.profile.role.name}</h2>
                </div>
                <div>
                  <Link to="#" className="text-[#3C6FD4] text-sm">
                    See analysis
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchTalent
