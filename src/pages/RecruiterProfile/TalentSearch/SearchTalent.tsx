import { Form, Formik } from 'formik'
import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  LocationSelect,
  resolveLocationFromNames,
} from '@/components/forms/LocationSelect'
import { RoleSelect } from '@/components/forms/Roles/RoleSelect'
import { EXPERIENCE_LEVEL_OPTIONS, Select } from '@/components/forms/Select'
import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { PagePanel } from '@/components/layout/PagePanel'
import { PageShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'

import styles from './SearchTalent.module.scss'

const SearchTalent = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  // Carried through, not a form field — set when arriving from a job page's
  // "Find matching talent" link, so results rank by fit to that job.
  const jobId = searchParams.get('jobId') || ''

  const initialSearchValues = {
    role: searchParams.get('role') || '',
    location: resolveLocationFromNames(
      searchParams.get('countryName') || undefined,
      searchParams.get('stateName') || undefined,
      searchParams.get('cityName') || undefined,
    ),
    experienceLevel: searchParams.get('experienceLevel') || '',
  }

  const onSubmit = async (values: typeof initialSearchValues) => {
    const { role, location, experienceLevel } = values

    const locationParams = {
      countryName: location.country.name,
      stateName: location.state.name,
      cityName: location.city.name,
    }

    setSearchParams({
      role,
      ...locationParams,
      experienceLevel,
      ...(jobId ? { jobId } : {}),
    })

    const queryParams = new URLSearchParams({
      role,
      ...locationParams,
      experienceLevel,
      ...(jobId ? { jobId } : {}),
    }).toString()

    navigate(`/recruiterDashboard/talent-search/results?${queryParams}`)
  }

  return (
    <PageShell>
      <PageHeaderTitle
        variant="hero"
        title="Talent Search"
        description="Find qualified talents by searching"
        onBack={() => navigate(-1)}
      />
      <PagePanel>
        <Formik initialValues={initialSearchValues} onSubmit={onSubmit}>
          {({ setFieldValue, values }) => (
            <Form className={styles.form}>
              <div className={styles.field}>
                <RoleSelect
                  label="Job Title"
                  name="role"
                  value={values.role}
                  onChange={(value) => setFieldValue('role', value)}
                  creatable={false}
                />
              </div>

              <div className={styles.field}>
                <LocationSelect
                  value={values.location}
                  onChange={(location) => setFieldValue('location', location)}
                  cityLabel="Region"
                />
              </div>

              <div className={styles.field}>
                <Select
                  label="Experience Level"
                  options={EXPERIENCE_LEVEL_OPTIONS}
                  value={values.experienceLevel}
                  onChange={(value) => setFieldValue('experienceLevel', value)}
                  placeholder="Select Experience Level"
                />
              </div>

              <div className={styles.actions}>
                <Button type="submit">Search</Button>
              </div>
            </Form>
          )}
        </Formik>
      </PagePanel>
    </PageShell>
  )
}

export default SearchTalent
