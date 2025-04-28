import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik'
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { Bounce } from 'react-toastify'
import * as Yup from 'yup'

import TextField from '../../../components/Form/TextField'
import Location from '../../../components/global/Location'
import CreatableRoleSelect from '../../../components/Roles/CreatableRoleSelect'
import { useJobPostCreationMutation } from '../../../redux/api/recruiter'
import { FormValues } from '../../../utils/jobPostTypes'
import LabelWithAsterisk from '../../../utils/LabelWithAstericks'
import { notify } from '../../../utils/toastNotifications'
import ExperienceLevelSelect from './ExperienceLevelSelect'
import WorkModeSelect from './WorkModeSelect'

const validationSchema = Yup.object({
  jobBrief: Yup.string().required('Job Brief is required'),
  minSalary: Yup.number()
    .required('Minimum Salary is required')
    .positive('Minimum Salary must be positive'),
  maxSalary: Yup.number()
    .required('Maximum Salary is required')
    .positive('Maximum Salary must be positive'),
  experienceLevel: Yup.string().required('Experience level is required'),
  workMode: Yup.string().required('Work Mode is required'),
  location: Yup.object({
    country: Yup.object({
      name: Yup.string().required('Country is required'),
      geoId: Yup.number().required('Country ID is required'),
    }),
    state: Yup.object({
      name: Yup.string().required('State is required'),
      geoId: Yup.number().required('State ID is required'),
    }),
  }),
  requirements: Yup.string().required('Requirements is required'),
  role: Yup.string().required('Role is required'),
  skills: Yup.array().of(
    Yup.string()
      .required('Skill is required')
      .max(250, 'Skill cannot be longer than 150 characters'),
  ),
  goals: Yup.array().of(
    Yup.string()
      .required('Goal is required')
      .max(250, 'Goal cannot be longer than 150 characters'),
  ),
})

const PostJob: React.FC = () => {
  const [jobId, setJobId] = useState(null)
  const [jobPostCreation] = useJobPostCreationMutation()

  const initialValues: FormValues = {
    jobBrief: '',
    role: '',
    requirements: '',
    minSalary: '',
    maxSalary: '',
    workMode: '',
    experienceLevel: '',
    location: {
      country: { name: '', geoId: null },
      state: { name: '', geoId: null },
      city: { name: '', geoId: null },
    },
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
      ...(values.location.city?.name
        ? { city: values.location.city?.name }
        : {}),
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
                <LabelWithAsterisk
                  asterick={true}
                  name="role"
                  label="Select Role"
                />
                <div className="py-2 pl-0 rounded-lg w-full">
                  <CreatableRoleSelect
                    name="role"
                    value={values.role}
                    onChange={(value: any) => {
                      setFieldValue('role', value)
                      // Update Formik state
                    }}
                    customHeight="60px"
                  />
                  {errors.role && touched.role ? (
                    <div className="text-red-500 text-sm">{errors.role}</div>
                  ) : null}
                </div>
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
                placeholder="Role requirements "
                type="textarea"
              />

              <div className="mb-4">
                <Location
                  locationTitle="Country"
                  locationLabel="Country"
                  geoId={null}
                  height="54px"
                  bold="bold"
                  asterick={true}
                  isCountry={true}
                  onChange={(geoId) => {
                    setFieldValue('location.country.geoId', geoId)
                    setFieldValue('location.state', { name: '', geoId: null })
                    setFieldValue('location.city', { name: '', geoId: null })
                  }}
                  customHeight="60px"
                />
                <ErrorMessage
                  name="location.country.name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <Location
                  locationTitle="State"
                  locationLabel="State"
                  geoId={values.location.country.geoId}
                  asterick={true}
                  height="54px"
                  bold="bold"
                  isCountry={false}
                  onChange={(geoId) => {
                    setFieldValue('location.state.geoId', geoId)
                    setFieldValue('location.city', { name: '', geoId: null })
                  }}
                  customHeight="60px"
                />
                <ErrorMessage
                  name="location.state.name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <Location
                  locationTitle="City"
                  locationLabel="Region/City (Optional)"
                  geoId={values.location.state.geoId}
                  height="54px"
                  bold="bold"
                  isCountry={false}
                  onChange={(geoId) => {
                    setFieldValue('location.city.geoId', geoId)
                  }}
                  customHeight="60px"
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
                <LabelWithAsterisk
                  label="Work Mode"
                  asterick={true}
                  name="workMode"
                />

                <Field
                  name="workMode"
                  render={({ field, form }: { field: any; form: any }) => (
                    <WorkModeSelect
                      value={field.value}
                      onChange={(value) =>
                        form.setFieldValue(field.name, value)
                      } // Set value to Formik field
                      customHeight="60px"
                    />
                  )}
                />

                <ErrorMessage
                  name="workMode"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="mb-4">
                <LabelWithAsterisk
                  label="Experience Level"
                  asterick={true}
                  name="experienceLevel"
                />

                <Field
                  name="experienceLevel"
                  render={({ field, form }: { field: any; form: any }) => (
                    <ExperienceLevelSelect
                      value={field.value}
                      onChange={(value) =>
                        form.setFieldValue(field.name, value)
                      } // Set value to Formik field
                      // options={options} // Pass the options
                      customHeight="60px"
                      options={[]}
                    />
                  )}
                />

                <ErrorMessage
                  name="experienceLevel"
                  component="div"
                  className="text-red-500 text-sm"
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
                  className="text-red-500 text-sm"
                />
              </div>
              {/* Goals */}
              <div className="mb-4">
                <LabelWithAsterisk asterick={true} name="goals" label="Goals" />
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
                  className="text-red-500 text-sm"
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
