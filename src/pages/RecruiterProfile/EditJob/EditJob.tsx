import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik'
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { RiDeleteBin6Line } from 'react-icons/ri'

import TextField from '../../../components/Form/TextField'
import Location from '../../../components/global/Location'
// import Loading from '../../../components/Loading/Loading'
import CreatableRoleSelect from '../../../components/Roles/CreatableRoleSelect'
import { useUpdateJobMutation } from '../../../redux/api/recruiter'
// import { useIndividualJobQuery } from '../../../redux/api/talent'
import { EditJobType } from '../../../utils'
import { capitalizeEachWord } from '../../../utils/CapitalizeWord'
import LabelWithAsterisk from '../../../utils/LabelWithAstericks'
import { notify } from '../../../utils/toastNotifications'
import ExperienceLevelSelect from '../PostJobs/ExperienceLevelSelect'
import { validationSchema } from '../PostJobs/validationSchema'
import WorkModeSelect from '../PostJobs/WorkModeSelect'

type Props = {
  jobToEdit: EditJobType | null
  jobId?: string
}

export const EditJob = ({ jobToEdit, jobId }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updateJob] = useUpdateJobMutation()

  const handleUpdateJob = async (values: EditJobType) => {
    setIsSubmitting(true)
    const location = {
      country: values?.location?.country?.name,
      state: values?.location?.state?.name,
      ...(values?.location?.city?.name
        ? { city: values?.location?.city?.name }
        : {}),
    }

    const { role, ...submissionValues } = {
      ...values,
      location,
    }

    try {
      await updateJob({ jobId, data: submissionValues }).unwrap()
      notify('success', 'Job updated successfully')
      setIsSubmitting(false)
    } catch (error) {
      notify('error', 'Failed to update job')
      console.error(error)
      setIsSubmitting(false)
    }
  }

  const initialValues: EditJobType = {
    jobBrief: jobToEdit?.jobBrief || '',
    role: jobToEdit?.role || { _id: '', name: '' },
    requirements: jobToEdit?.requirements || '',
    minSalary: jobToEdit?.minSalary || 0,
    maxSalary: jobToEdit?.maxSalary || 0,
    workMode: jobToEdit?.workMode || undefined,
    experienceLevel: jobToEdit?.experienceLevel || '',
    location: jobToEdit?.location || {
      country: '',
      state: '',
      city: '',
    },
    skills: jobToEdit?.skills || [],
    goals: jobToEdit?.goals || [],
  }

  return (
    <div className="md:px-4 py-4 w-full">
      <div className="md:w-[70%] mx-auto w-full">
        <h2 className="text-[#101828] text-[32px] mt-6 font-bold">
          Edit {capitalizeEachWord(jobToEdit?.role?.name)} Job
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={() => {}}>
          {({ values, setFieldValue, errors, touched }) => (
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
                    isDisabled={true}
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
                placeholder="Role requirements"
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
                  selectedName={values?.location?.country}
                  isCountry={true}
                  onChange={(geoId) => {
                    setFieldValue('location.country.geoId', geoId)
                    setFieldValue('location.state', {
                      name: '',
                      geoId: null,
                    })
                    setFieldValue('location.city', {
                      name: '',
                      geoId: null,
                    })
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
                  selectedName={values?.location?.state}
                  geoId={values?.location?.country?.geoId}
                  asterick={true}
                  height="54px"
                  bold="bold"
                  isCountry={false}
                  onChange={(geoId) => {
                    setFieldValue('location.state.geoId', geoId)
                    setFieldValue('location.city', {
                      name: '',
                      geoId: null,
                    })
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
                  selectedName={values?.location?.city as string}
                  geoId={values?.location?.state?.geoId}
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
                      }
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
                      {values?.skills?.map((skill, index) => (
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
                <LabelWithAsterisk
                  asterick={true}
                  name="goals"
                  label="Top 3 Goals"
                />
                <FieldArray name="goals">
                  {({ remove, push }) => (
                    <div>
                      {values?.goals?.map((goal, index) => (
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
                <button
                  type="submit"
                  className="bg-[#3C6FD4] text-white py-3 px-20 rounded hover:bg-blue-700 transition duration-300"
                  disabled={isSubmitting}
                  onClick={() => handleUpdateJob(values)}>
                  {isSubmitting ? 'Submitting' : 'Submit'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
