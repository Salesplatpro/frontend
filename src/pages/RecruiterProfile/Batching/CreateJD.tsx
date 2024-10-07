import { Alert } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import React, { ChangeEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import { getRole } from '../../../api/api-communication'
import { useCreateJDMutation } from '../../../redux/api/recruiter'

type RoleType = {
  _id: string
  name: string
  description: string
}

const CreateJD = () => {
  const navigate = useNavigate()
  const [fetchedRoles, setFetchedRoles] = useState<RoleType[]>([])
  const [error, setError] = useState<string | null>(null) // State for error
  const [createJD, { isLoading }] = useCreateJDMutation()

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
  }

  const handleSubmit = async (values: any) => {
    console.log(values)
    try {
      const result = await createJD(values).unwrap()
      toast.success(result.message)
      navigate(`/recruiterDashboard/scout/${result.data._id}`)
    } catch (error: any) {
      console.error('Error creating Job Description:', error.data.message)
      setError('Error creating Job Description')
    }
  }

  return (
    <div className="py-4 space-y-4">
      <div className="space-y-2">
        <h1 className="font-raleway text-[#101828] text-[32px] font-bold leading-[37.57px]">
          Scout
        </h1>
        <p className="font-raleway font-normal text-[20px] leading-[23.48px] text-[#101828]">
          Upload CV in batch for collective AI assessment
        </p>
      </div>
      {error && <Alert severity="error">{error} </Alert>}
      <div className="flex justify-center items-center lg:mx-32 md:mx-24 sm:mx-20 ">
        <Formik
          initialValues={{
            name: '',
            role: '',
            description: '',
            recruiterGuide: '',
          }}
          onSubmit={handleSubmit}>
          {({ setFieldValue, values }) => (
            <Form className="lg:flex lg:flex-col lg:justify-start lg:items-start lg:w-[700px] md:w-[600px] md:flex md:flex-col md:justify-start md: items-start sm:w-[550px] h-[550px] w-[300px] rounded-2xl mt-10 space-y-3">
              <div>
                <label
                  htmlFor="name"
                  className="text-[#434144] font-raleway font-bold leading-4 text-[16px]">
                  Campaign Name
                </label>
                <Field
                  name="name"
                  type="text"
                  placeholder="Campaign name"
                  className="w-[320px] lg:w-[674px] h-[54px] md:w-[550px] sm:w-[490px] border border-[#D0D5DD] rounded-lg pl-3 mt-2"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="text-[#434144] font-raleway font-bold leading-4 text-[16px]">
                  Job Title (Role)
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
                  className="text-[#434144] font-raleway font-bold leading-4 text-[16px]">
                  Description
                </label>
                <Field
                  name="description"
                  as="textarea"
                  className="w-[320px] lg:w-[674px] md:w-[550px] sm:w-[490px] border border-[#D0D5DD] rounded-lg pl-3 mt-2"
                  placeholder="Add Job description here"
                  rows={4}
                />
              </div>

              <div>
                <label
                  htmlFor="recruiterGuide"
                  className="text-[#434144] font-raleway font-bold leading-4 text-[16px]">
                  Recruiters Guide
                </label>
                <Field
                  name="recruiterGuide"
                  type="text"
                  className="w-[320px] lg:w-[674px] h-[54px] md:w-[550px] sm:w-[490px] border border-[#D0D5DD] rounded-lg pl-3 mt-2"
                  placeholder="Enter your preferred guide here"
                />
              </div>

              <button
                type="submit"
                className="w-[270px] lg:w-[358px] md:w-[300px] sm:w-[320px] rounded-lg bg-[#3c6fd4] flex justify-center items-center hover:bg-[#4b82e1] py-3 mt-8"
                disabled={isLoading}>
                <p className="text-white font-semibold font-raleway leading-[24px] text-[17px]">
                  {isLoading ? 'Submitting...' : 'Create'}
                </p>
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default CreateJD
