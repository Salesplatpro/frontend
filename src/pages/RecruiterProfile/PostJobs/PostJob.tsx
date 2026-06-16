import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik'
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { Bounce } from 'react-toastify'

import {
  EMPTY_LOCATION,
  LocationSelect,
} from '@/components/forms/LocationSelect'
import { RoleSelect } from '@/components/forms/Roles/RoleSelect'
import {
  CURRENCY_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  Select,
  WORK_MODE_OPTIONS,
} from '@/components/forms/Select'
import TextField from '@/components/forms/TextField'

import { useJobPostCreationMutation } from '../../../redux/api/recruiter'
import { FormValues } from '../../../utils/jobPostTypes'
import LabelWithAsterisk from '../../../utils/LabelWithAstericks'
import { notify } from '../../../utils/toastNotifications'
import { validationSchema } from './validationSchema'

const PostJob: React.FC = () => {
  const [jobId, setJobId] = useState(null)
  const [jobPostCreation] = useJobPostCreationMutation()

  const initialValues: FormValues = {
    jobBrief: '',
    role: '',
    requirements: '',
    minSalary: '',
    maxSalary: '',
    currency: '',
    workMode: '',
    experienceLevel: '',
    location: { ...EMPTY_LOCATION },
    skills: [''],
    goals: [''],
  }

  const onSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    const location = {
      country: values.location.country.name,
      state: values.location.state.name,
      ...(values.location.city.name ? { city: values.location.city.name } : {}),
    }
    const submissionValues = {
      ...values,
      location,
    }
    try {
      const data = await jobPostCreation(submissionValues).unwrap()
      console.log(data)
      if (data.status) {
        notify('success', `Job Post Created successfully`, {
          autoClose: 5000,
        })

        setJobId(data?.data._id)
      } else {
        notify('error', data.message, {
          autoClose: 5000,
          transition: Bounce,
        })
      }
    } catch (error) {
      notify('error', 'Failed to create job post', {
        autoClose: 5000,
        transition: Bounce,
      })
    }
    setSubmitting(false)
  }

  return (
    <div className="md:px-4 py-4 w-full">
      <div className="md:w-[70%] mx-auto w-full">
        <h2 className="text-grey-900 text-[32px] mt-6 font-bold">
          Job details
        </h2>
        <p className="text-grey-500 text-[16px] mb-6 font-light">
          Tell us about your job
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}>
          {({ values, isSubmitting, setFieldValue, errors, touched }) => (
            <Form>
              <div className="mb-4">
                <RoleSelect
                  label="Select Role"
                  required
                  name="role"
                  value={values.role}
                  onChange={(value) => setFieldValue('role', value)}
                  creatable
                  error={
                    touched.role && typeof errors.role === 'string'
                      ? errors.role
                      : undefined
                  }
                />
              </div>
              <TextField
                label="Job Brief"
                asterick={true}
                name="jobBrief"
                placeholder="Add Job Brief (600 words max)"
                type="textarea"
                MAX_WORDS={600}
              />
              <TextField
                label="Requirements"
                name="requirements"
                asterick={true}
                placeholder="Role requirements"
                type="textarea"
              />

              <div className="mb-4">
                <LocationSelect
                  value={values.location}
                  onChange={(location) => setFieldValue('location', location)}
                  cityLabel="Region/City (Optional)"
                  countryRequired
                  stateRequired
                  errors={{
                    country:
                      touched.location?.country &&
                      typeof errors.location?.country?.name === 'string'
                        ? errors.location.country.name
                        : undefined,
                    state:
                      touched.location?.state &&
                      typeof errors.location?.state?.name === 'string'
                        ? errors.location.state.name
                        : undefined,
                  }}
                />
              </div>
              <div className="mb-4">
                <Select
                  label="Currency"
                  required
                  options={CURRENCY_OPTIONS}
                  value={values.currency}
                  onChange={(value) => setFieldValue('currency', value)}
                  placeholder="Select currency"
                  error={
                    touched.currency && typeof errors.currency === 'string'
                      ? errors.currency
                      : undefined
                  }
                />
              </div>
              <TextField
                label="Minimum Salary"
                name="minSalary"
                asterick={true}
                placeholder="Min Salary"
                type="text"
              />
              <TextField
                label="Maximum Salary"
                name="maxSalary"
                asterick={true}
                placeholder="Max Salary"
                type="text"
              />

              <div className="mb-4">
                <Select
                  label="Work Mode"
                  required
                  options={WORK_MODE_OPTIONS}
                  value={values.workMode}
                  onChange={(value) => setFieldValue('workMode', value)}
                  placeholder="Select work mode"
                  error={
                    touched.workMode && typeof errors.workMode === 'string'
                      ? errors.workMode
                      : undefined
                  }
                />
              </div>

              <div className="mb-4">
                <Select
                  label="Experience Level"
                  required
                  options={EXPERIENCE_LEVEL_OPTIONS}
                  value={values.experienceLevel}
                  onChange={(value) => setFieldValue('experienceLevel', value)}
                  placeholder="Select experience level"
                  error={
                    touched.experienceLevel &&
                    typeof errors.experienceLevel === 'string'
                      ? errors.experienceLevel
                      : undefined
                  }
                />
              </div>
              {/* skills */}
              <div className="mb-4">
                <LabelWithAsterisk
                  asterick={true}
                  label="Skills"
                  name="skills"
                />
                <FieldArray name="skills">
                  {({ remove, push }) => (
                    <div>
                      {values.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex mb-2 items-center space-x-0">
                          <Field
                            name={`skills.${index}`}
                            className="border border-grey-300 p-4 rounded-lg w-full"
                          />
                          <div
                            className="p-2 text-[20px] text-grey-500 cursor-pointer rounded-lg"
                            onClick={() => remove(index)}>
                            <RiDeleteBin6Line />
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="px-4 py-2 bg-[#d7e8ff] text-info rounded-3xl border border-info b-2 hover:bg-[#92bfff]"
                        onClick={() => push('')}>
                        <span className="flex items-center gap-2">
                          <FaPlus /> Add Skill
                        </span>
                      </button>
                    </div>
                  )}
                </FieldArray>
                <ErrorMessage
                  name="skills"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              {/* Goals */}
              <div className="mb-4">
                <LabelWithAsterisk
                  asterick={true}
                  name="goals"
                  label="Top 3 Goals"
                />
                <FieldArray name="goals">
                  {({ remove, push }) => (
                    <div>
                      {values.goals.map((goal, index) => (
                        <div
                          key={index}
                          className="flex mb-2 items-center space-x-0">
                          <Field
                            name={`goals.${index}`}
                            className="border border-grey-300 p-4 rounded w-full"
                          />
                          <div
                            className="p-2 text-[20px] text-grey-500 cursor-pointer rounded"
                            onClick={() => remove(index)}>
                            <RiDeleteBin6Line />
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="px-4 py-2 bg-[#d7e8ff] text-info rounded-3xl border border-info b-2 hover:bg-[#92bfff]"
                        onClick={() => push('')}>
                        <span className="flex items-center gap-2">
                          <FaPlus /> Add Goal
                        </span>
                      </button>
                    </div>
                  )}
                </FieldArray>
                <ErrorMessage
                  name="goals"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mt-10">
                {jobId !== null ? (
                  <Link to={`/recruiterDashboard/postjob/${jobId}`}>
                    <button className="px-20 py-3 bg-primary-strong text-white rounded hover:bg-blue-700">
                      Next
                    </button>
                  </Link>
                ) : (
                  <div>
                    <button
                      type="submit"
                      className="bg-primary-strong text-white py-3 px-20 rounded hover:bg-blue-700 transition duration-300"
                      disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting' : 'Submit'}
                    </button>
                  </div>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default PostJob
