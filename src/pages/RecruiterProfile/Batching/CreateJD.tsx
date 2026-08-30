import { Form, Formik } from 'formik'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { RoleSelect } from '@/components/forms/Roles/RoleSelect'
import { TextInput } from '@/components/forms/TextInput'
import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { PagePanel } from '@/components/layout/PagePanel'
import { PageShell } from '@/components/layout/PageShell'
import { getErrorMessage } from '@/utils/getErrorMessage'

import { Button } from '../../../components'
import { useCreateJDMutation } from '../../../redux/api/recruiter'
import { notify } from '../../../utils/toastNotifications'
import styles from './CreateJD.module.scss'
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
    <PageShell>
      <PageHeaderTitle
        variant="hero"
        title="New Scout Job"
        description="Set up a job description to scout and score talent against"
        onBack={() => navigate(-1)}
      />
      <PagePanel>
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
            <Form className={styles.form}>
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

              <div className={styles.field}>
                <label htmlFor="jobBrief" className={styles.label}>
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
                  className={styles.textarea}
                />
                {touched.jobBrief && typeof errors.jobBrief === 'string' && (
                  <div className={styles.error}>{errors.jobBrief}</div>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="recruiterGuide" className={styles.label}>
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
                  className={styles.textarea}
                />
                {touched.recruiterGuide &&
                  typeof errors.recruiterGuide === 'string' && (
                    <div className={styles.error}>{errors.recruiterGuide}</div>
                  )}
              </div>

              <div className={styles.actions}>
                <Button
                  type="submit"
                  variant="primary"
                  loading={isLoading}
                  disabled={isLoading}>
                  Create Scout Job
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </PagePanel>
    </PageShell>
  )
}

export default CreateJD
