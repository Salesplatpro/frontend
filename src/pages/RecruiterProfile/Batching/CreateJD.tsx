import { Form, Formik } from 'formik'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { RoleSelect } from '@/components/forms/Roles/RoleSelect'
import { TextInput } from '@/components/forms/TextInput'
import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { Card } from '@/components/ui/Card'
import { getErrorMessage } from '@/utils/getErrorMessage'

import { Button } from '../../../components'
import { useCreateJDMutation } from '../../../redux/api/recruiter'
import { notify } from '../../../utils/toastNotifications'
import { scoutJobValidationSchema } from './validationSchema'

interface ScoutJobFormValues {
  name: string
  role: string
  jobBrief: string
  recruiterGuide: string
}

const initialValues: ScoutJobFormValues = {
  name: '',
  role: '',
  jobBrief: '',
  recruiterGuide: '',
}

const CreateJD = () => {
  const navigate = useNavigate()
  const [createJD, { isLoading }] = useCreateJDMutation()

  const handleSubmit = async (values: ScoutJobFormValues) => {
    try {
      const result = await createJD(values).unwrap()
      notify('success', result.message, { autoClose: 2000 })
      navigate(`/recruiterDashboard/scout/${result.data.scoutJob.id}`)
    } catch (error) {
      notify('error', getErrorMessage(error, 'Error creating scout job'))
    }
  }

  return (
    <div className="py-4 space-y-4">
      <PageHeaderTitle
        title="New Scout Job"
        description="Set up a job description to scout and score talent against"
      />
      <div className="flex justify-center items-center">
        <Card className="w-full max-w-2xl p-6 mt-6">
          <Formik
            initialValues={initialValues}
            validationSchema={scoutJobValidationSchema}
            onSubmit={handleSubmit}>
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              setFieldValue,
            }) => (
              <Form className="flex flex-col space-y-4">
                <TextInput
                  title="Campaign Name"
                  label="name"
                  name="name"
                  autoComplete="off"
                  placeholder="Campaign name"
                  required
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.name && typeof errors.name === 'string'
                      ? errors.name
                      : undefined
                  }
                />

                <RoleSelect
                  label="Job Title (Role)"
                  name="role"
                  value={values.role}
                  onChange={(value) => setFieldValue('role', value)}
                  required
                  creatable={false}
                  error={
                    touched.role && typeof errors.role === 'string'
                      ? errors.role
                      : undefined
                  }
                />

                <div>
                  <label
                    htmlFor="jobBrief"
                    className="text-grey-700 font-raleway font-bold leading-4 text-base">
                    Job Brief
                  </label>
                  <textarea
                    id="jobBrief"
                    name="jobBrief"
                    value={values.jobBrief}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={4}
                    placeholder="Describe the role you're scouting for"
                    className="w-full border border-grey-300 rounded-lg p-3 mt-2"
                  />
                  {touched.jobBrief && typeof errors.jobBrief === 'string' && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.jobBrief}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="recruiterGuide"
                    className="text-grey-700 font-raleway font-bold leading-4 text-base">
                    Recruiter&apos;s Guide
                  </label>
                  <textarea
                    id="recruiterGuide"
                    name="recruiterGuide"
                    value={values.recruiterGuide}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={3}
                    placeholder="How should CVs be assessed against this role?"
                    className="w-full border border-grey-300 rounded-lg p-3 mt-2"
                  />
                  {touched.recruiterGuide &&
                    typeof errors.recruiterGuide === 'string' && (
                      <div className="text-red-600 text-sm mt-1">
                        {errors.recruiterGuide}
                      </div>
                    )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="wide"
                  fullWidth
                  loading={isLoading}
                  disabled={isLoading}>
                  Create Scout Job
                </Button>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </div>
  )
}

export default CreateJD
