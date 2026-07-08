import './JobFilter.scss'

import { Form, Formik } from 'formik'
import React, { Dispatch, SetStateAction } from 'react'

import Worktype from '@/components/features/jobs/Worktype'
import {
  EMPTY_LOCATION,
  LocationSelect,
} from '@/components/forms/LocationSelect'
import { RoleSelect } from '@/components/forms/Roles/RoleSelect'
import { EXPERIENCE_LEVEL_OPTIONS, Select } from '@/components/forms/Select'

import { useScreenWidth } from '../../../hooks'
import { JobFiltersTypes } from '../../../utils/jobPostTypes'

interface JobFiltersProps {
  onFilterSubmit: (filterValues: JobFiltersTypes) => void
  showFilter: boolean
  setShowFilter: Dispatch<SetStateAction<boolean>>
}

export const JobFilter: React.FC<JobFiltersProps> = ({
  onFilterSubmit,
  showFilter,
  setShowFilter,
}) => {
  const screenWidth = useScreenWidth()

  const initialValues: JobFiltersTypes = {
    role: '',
    experienceLevel: '',
    location: { ...EMPTY_LOCATION },
    remote: false,
    onSite: false,
    hybrid: false,
  }

  const onSubmit = async (
    values: JobFiltersTypes,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setSubmitting(true)
    onFilterSubmit(values)

    setShowFilter(false)

    console.log(values)
    setSubmitting(false)
  }

  return (
    <div className="filter ">
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, isSubmitting, setFieldValue }) => (
          <Form>
            <div className="filter-top z-10">
              <div className="title">Filter</div>
              <button
                type="button"
                className="clear"
                onClick={() => {
                  setFieldValue('role', '')
                  setFieldValue('experienceLevel', '')
                  setFieldValue('location', { ...EMPTY_LOCATION })
                  if (screenWidth < 768) {
                    setShowFilter(!showFilter)
                  }
                }}>
                Clear/Close
              </button>
            </div>
            {/* <SearchBox /> */}
            <div>
              <div className="line" />
              <div>
                <RoleSelect
                  label="Role"
                  name="role"
                  value={values.role}
                  onChange={(value) => setFieldValue('role', value)}
                  creatable={false}
                />
              </div>
              <div className="line" />
              <div className="mb-4">
                <Select
                  label="Experience Level"
                  options={EXPERIENCE_LEVEL_OPTIONS}
                  value={values.experienceLevel}
                  onChange={(value) => setFieldValue('experienceLevel', value)}
                  placeholder="Select Experience Level"
                />
              </div>
              <div className="line" />

              <div className="mb-4">
                <label className="block mb-2 font-bold" htmlFor="remote">
                  Work Type
                </label>
                <Worktype
                  options={[
                    { value: 'remote', label: 'Remote' },
                    { value: 'onSite', label: 'On Site' },
                    { value: 'hybrid', label: 'Hybrid' },
                  ]}
                  initialSelected={{
                    remote: values.remote,
                    onSite: values.onSite,
                    hybrid: values.hybrid,
                  }}
                  onSelectionChange={(selected) => {
                    setFieldValue('remote', selected.remote)
                    setFieldValue('onSite', selected.onSite)
                    setFieldValue('hybrid', selected.hybrid)
                  }}
                />
              </div>
              <div className="line" />
              <LocationSelect
                value={values.location}
                onChange={(location) => setFieldValue('location', location)}
              />
              <div className="line" />

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700
             border-none outline-none focus:outline-none focus:ring-0 active:ring-0 shadow-none">
                  {isSubmitting ? 'applying...' : 'Apply'}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
