import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FaPlus } from 'react-icons/fa6'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { Link, useParams } from 'react-router-dom'
import * as Yup from 'yup'

import Location from '../../../components/global/Location'
import AllRoles from '../../../components/Roles/AllRoles'
import { useJobPostCreationMutation } from '../../../redux/api/recruiter'
import { FormValues, LocationValues } from '../../../utils/jobPostTypes'

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
  // const { aiConfigId } = useParams()
  const [jobPostCreation] = useJobPostCreationMutation()

  const initialValues: FormValues = {
    description: '',
    // aiConfig: aiConfigId,
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
        toast.success('Job Post Created successfully')
        setJobId(data?.data._id)
        console.log(data?.data._id)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to create job post')
    }
    console.log(submissionValues)
    console.log('submissionValues')
    setSubmitting(false)
  }
  return (
    <div className="p-4 w-full">
      <div className="w-[60%] mx-auto">
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
                <div className="border border-[#D0D5DD] py-4 pl-4 rounded-lg w-full">
                  <AllRoles
                    name="role"
                    value={values.role}
                    onChange={(e) => setFieldValue('role', e.target.value)}
                  />
                  {errors.role && touched.role ? (
                    <div className="text-red-500 text-sm">{errors.role}</div>
                  ) : null}
                </div>
              </div>
              <div className="mb-4">
                <label
                  className="font-bold text-[14px] text-[#434144]"
                  htmlFor="description">
                  Description
                </label>
                <Field
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Add Job description"
                  className="block border border-[#D0D5DD] p-4 rounded-lg w-full"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-4">
                <Location
                  locationTitle="Country"
                  geoId={null}
                  height="54px"
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
                  geoId={values.location.country.geoId}
                  height="54px"
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
                  geoId={values.location.state.geoId}
                  height="54px"

                  isCountry={false}
                  onChange={(geoId) => {
                    setFieldValue('location.city.geoId', geoId)
                  }}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block font-bold text-[14px] text-[#434144]"
                  htmlFor="minSalary">
                  Min Salary
                </label>
                <Field
                  type="text"
                  id="minSalary"
                  name="minSalary"
                  className="border border-[#D0D5DD] p-4 rounded-lg w-full"
                />
                <ErrorMessage
                  name="minSalary"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block font-bold text-[14px] text-[#434144]"
                  htmlFor="maxSalary">
                  Max Salary
                </label>
                <Field
                  type="text"
                  id="maxSalary"
                  name="maxSalary"
                  placeholder="100000"
                  className="border border-[#D0D5DD] p-4 rounded-lg w-full"
                />
                <ErrorMessage
                  name="maxSalary"
                  component="div"
                  className="text-red-500"
                />
              </div>
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
                  <option value="senior">Senior</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="junior">Junior</option>
                </Field>
                <ErrorMessage
                  name="experienceLevel"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block font-bold text-[14px] text-[#434144]"
                  htmlFor="address">
                  Address
                </label>
                <Field
                  type="text"
                  id="address"
                  name="address"
                  placeholder="address"
                  className="border border-[#D0D5DD] p-4 rounded-lg w-full"
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-red-500"
                />
              </div>
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
                  <option value="true">True</option>
                  <option value="false">False</option>
                </Field>
                <ErrorMessage
                  name="remote"
                  component="div"
                  className="text-red-500"
                />
              </div>
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
                          className="flex mb-2 items-center relative">
                          <Field
                            name={`responsibilities.${index}`}
                            className="border border-[#D0D5DD] p-4 rounded-lg w-full"
                          />
                          <div
                            className="p-2 text-[18px] text-[#667085] cursor-pointer rounded-lg absolute right-2"
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
                          className="flex mb-2 items-center relative">
                          <Field
                            name={`skills.${index}`}
                            className="border border-[#D0D5DD] p-4 rounded-lg w-full"
                          />
                          <div
                            className="p-2 text-[18px] text-[#667085] cursor-pointer rounded-lg absolute right-2"
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
                          className="flex mb-2 items-center relative">
                          <Field
                            name={`goals.${index}`}
                            className="border border-[#D0D5DD] p-4 rounded w-full"
                          />
                          <div
                            className="p-2 text-[18px] text-[#667085] cursor-pointer rounded absolute right-2"
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
