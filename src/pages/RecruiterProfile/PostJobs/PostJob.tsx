import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik'
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { Bounce } from 'react-toastify'
import * as Yup from 'yup'

import TextField from '../../../components/Form/TextField'
import Location from '../../../components/global/Location'
import AllRoles from '../../../components/Roles/AllRoles'
import { useJobPostCreationMutation } from '../../../redux/api/recruiter'
import { experienceLevel } from '../../../utils'
import { FormValues } from '../../../utils/jobPostTypes'
import { notify } from '../../../utils/toastNotifications'

const validationSchema = Yup.object({
  description: Yup.string().required('Description is required'),
  minSalary: Yup.number()
    .required('Minimum Salary is required')
    .positive('Minimum Salary must be positive'),
  maxSalary: Yup.number()
    .required('Maximum Salary is required')
    .positive('Maximum Salary must be positive'),
  experienceLevel: Yup.string().required('experienceLevel level is required'),
  location: Yup.object({
    country: Yup.object({
      name: Yup.string().required('Country is required'),
      geoId: Yup.number().required('Country ID is required'),
    }),
    state: Yup.object({
      name: Yup.string().required('State is required'),
      geoId: Yup.number().required('State ID is required'),
    }),
    city: Yup.object({
      name: Yup.string().required('City is required'),
      geoId: Yup.number().required('City ID is required'),
    }),
  }),
  address: Yup.string().required('Address is required'),
  remote: Yup.string().required('Remote option is required'),
  responsibilities: Yup.array().of(
    Yup.string()
      .required('Responsibility is required')
      .max(150, 'Responsibility cannot be longer than 150 characters'),
  ),
  skills: Yup.array().of(
    Yup.string()
      .required('Skill is required')
      .max(150, 'Skill cannot be longer than 150 characters'),
  ),
  goals: Yup.array().of(
    Yup.string()
      .required('Goal is required')
      .max(150, 'Goal cannot be longer than 150 characters'),
  ),
})

const PostJob: React.FC = () => {
  const [jobId, setJobId] = useState(null)
  const [jobPostCreation] = useJobPostCreationMutation()

  const initialValues: FormValues = {
    description: '',
    role: '',
    minSalary: '',
    maxSalary: '',
    experienceLevel: '',
    location: {
      country: { name: '', geoId: null },
      state: { name: '', geoId: null },
      city: { name: '', geoId: null },
    },
    address: '',
    remote: '',
    responsibilities: [''],
    skills: [''],
    goals: [''],
  }

  const onSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    const submissionValues = {
      ...values,
      location: {
        country: values.location.country.name,
        state: values.location.state.name,
        city: values.location.city.name,
      },
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
        <h2 className="text-[#101828] text-[32px] mt-6 font-bold">
          Job details
        </h2>
        <p className="text-[#667085] text-[16px] mb-6 font-light">
          Tell us about your job
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}>
          {({ values, isSubmitting, setFieldValue, errors, touched }) => (
            <Form>
              <div className="mb-4">
                <h5 className="font-bold text-[14px] text-[#434144]">
                  Select Role
                </h5>
                <div className="py-2 pl-0 rounded-lg w-full">
                  <AllRoles
                    name="role"
                    value={values.role}
                    onChange={(value: any) => {
                      setFieldValue('role', value) // Update Formik state
                    }}
                  />
                  {errors.role && touched.role ? (
                    <div className="text-red-500 text-sm">{errors.role}</div>
                  ) : null}
                </div>
              </div>
              <TextField
                label="description"
                name="description"
                placeholder="Add Job description"
                type="text"
              />
              <div className="mb-4">
                <Location
                  locationTitle="Country"
                  locationLabel="Country"
                  geoId={null}
                  height="54px"
                  bold="bold"
                  isCountry={true}
                  onChange={(geoId) => {
                    setFieldValue('location.country.geoId', geoId)
                    setFieldValue('location.state', { name: '', geoId: null })
                    setFieldValue('location.city', { name: '', geoId: null })
                  }}
                />
              </div>
              <div className="mb-4">
                <Location
                  locationTitle="State"
                  locationLabel="States/Province"
                  geoId={values.location.country.geoId}
                  height="54px"
                  bold="bold"
                  isCountry={false}
                  onChange={(geoId) => {
                    setFieldValue('location.state.geoId', geoId)
                    setFieldValue('location.city', { name: '', geoId: null })
                  }}
                />
              </div>
              <div className="mb-4">
                <Location
                  locationTitle="City"
                  locationLabel="Region"
                  geoId={values.location.state.geoId}
                  height="54px"
                  bold="bold"
                  isCountry={false}
                  onChange={(geoId) => {
                    setFieldValue('location.city.geoId', geoId)
                  }}
                />
              </div>
              <TextField
                label="minSalary"
                name="minSalary"
                placeholder="Min Salary"
                type="text"
              />
              <TextField
                label="maxSalary"
                name="maxSalary"
                placeholder="Max Salary"
                type="text"
              />
              <div className="mb-4">
                <label
                  className="block font-bold text-[14px] text-[#434144]"
                  htmlFor="experienceLevel">
                  Experience Level
                </label>
                <Field
                  as="select"
                  id="experienceLevel"
                  name="experienceLevel"
                  className="border border-[#D0D5DD] p-5 rounded-lg w-full">
                  <option value="">Select experience Level</option>
                  {Object.values(experienceLevel).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="experienceLevel"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <TextField
                label="Address"
                name="address"
                placeholder="Address"
                type="text"
              />
              <div className="mb-4">
                <label
                  className="font-bold text-[14px] text-[#434144] block"
                  htmlFor="remote">
                  Remote
                </label>
                <Field
                  as="select"
                  id="remote"
                  name="remote"
                  className="border border-[#D0D5DD] p-5 rounded-lg w-full">
                  <option value="">Select Remote Option</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Field>
                <ErrorMessage
                  name="remote"
                  component="div"
                  className="text-red-500"
                />
              </div>
              {/* Responsibility */}
              <div className="mb-4">
                <label
                  className="font-bold text-[14px] text-[#434144] block"
                  htmlFor="responsibilities">
                  Responsibilities
                </label>
                <FieldArray name="responsibilities">
                  {({ remove, push }) => (
                    <div>
                      {values.responsibilities.map((responsibility, index) => (
                        <div
                          key={index}
                          className="flex mb-2 items-center space-x-0">
                          <Field
                            name={`responsibilities.${index}`}
                            className="border border-[#D0D5DD] p-4 rounded-lg w-full"
                          />
                          <div
                            className="p-2 text-[20px] text-[#667085] cursor-pointer rounded-lg"
                            onClick={() => remove(index)}>
                            <RiDeleteBin6Line />
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="px-4 py-2 bg-[#d7e8ff] text-[#006BFF] rounded-3xl border border-[#006BFF] b-2 hover:bg-[#92bfff]"
                        onClick={() => push('')}>
                        <span className="flex items-center gap-2">
                          <FaPlus /> Add Responsibility
                        </span>
                      </button>
                    </div>
                  )}
                </FieldArray>
                <ErrorMessage
                  name="responsibilities"
                  component="div"
                  className="text-red-500"
                />
              </div>
              {/* skills */}
              <div className="mb-4">
                <label
                  className="font-bold text-[14px] text-[#434144] block"
                  htmlFor="skills">
                  Skills
                </label>
                <FieldArray name="skills">
                  {({ remove, push }) => (
                    <div>
                      {values.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex mb-2 items-center space-x-0">
                          <Field
                            name={`skills.${index}`}
                            className="border border-[#D0D5DD] p-4 rounded-lg w-full"
                          />
                          <div
                            className="p-2 text-[20px] text-[#667085] cursor-pointer rounded-lg"
                            onClick={() => remove(index)}>
                            <RiDeleteBin6Line />
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="px-4 py-2 bg-[#d7e8ff] text-[#006BFF] rounded-3xl border border-[#006BFF] b-2 hover:bg-[#92bfff]"
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
                  className="text-red-500"
                />
              </div>
              {/* Goals */}
              <div className="mb-4">
                <label
                  className="font-bold text-[14px] text-[#434144] block"
                  htmlFor="goals">
                  Goals
                </label>
                <FieldArray name="goals">
                  {({ remove, push }) => (
                    <div>
                      {values.goals.map((goal, index) => (
                        <div
                          key={index}
                          className="flex mb-2 items-center space-x-0">
                          <Field
                            name={`goals.${index}`}
                            className="border border-[#D0D5DD] p-4 rounded w-full"
                          />
                          <div
                            className="p-2 text-[20px] text-[#667085] cursor-pointer rounded"
                            onClick={() => remove(index)}>
                            <RiDeleteBin6Line />
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="px-4 py-2 bg-[#d7e8ff] text-[#006BFF] rounded-3xl border border-[#006BFF] b-2 hover:bg-[#92bfff]"
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
                  className="text-red-500"
                />
              </div>
              <div className="mt-10">
                {jobId !== null ? (
                  <Link to={`/recruiterDashboard/postjob/${jobId}`}>
                    <button className="px-20 py-3 bg-[#3C6FD4] text-white rounded hover:bg-blue-700">
                      Next
                    </button>
                  </Link>
                ) : (
                  <div>
                    <button
                      type="submit"
                      className="bg-[#3C6FD4] text-white py-3 px-20 rounded hover:bg-blue-700 transition duration-300"
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
