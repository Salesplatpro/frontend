import './JobFilter.scss'

import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useState } from 'react'

import Location from '../../../components/global/Location'
import AllRoles from '../../../components/Roles/AllRoles'
import { JobFiltersTypes } from '../../../utils/jobPostTypes'

interface JobFiltersProps {
  onFilterSubmit: (filterValues: JobFiltersTypes) => void
}

export const JobFilter: React.FC<JobFiltersProps> = ({ onFilterSubmit }) => {
  // eslint-disable-next-line no-unused-vars
  const [selectItemToggle, setSelectItemToggle] = useState(false)

  const initialValues: JobFiltersTypes = {
    role: '',
    experienceLevel: '',
    remote: '',
    location: {
      country: { name: '', geoId: null },
      state: { name: '', geoId: null },
      city: { name: '', geoId: null },
    },
  }

  const onSubmit = async (
    values: JobFiltersTypes,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    onFilterSubmit(values)
    setSubmitting(false)
  }

  return (
    <div className="filter">
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, isSubmitting, setFieldValue }) => (
          <Form>
            <div className="filter-top">
              <div className="title">Filter</div>
              <button
                type="button"
                className="clear"
                onClick={() => setFieldValue('role', '')}>
                Clear/Close
              </button>
            </div>
            {/* <SearchBox /> */}
            <div>
              <div className="line" />
              <div>
                <label className="block mb-2 font-bold" htmlFor="role">
                  Role
                </label>
                <AllRoles
                  className="border border-gray-300 p-2 mt-2 rounded shadow-lg w-full"
                  name="role"
                  value={values.role}
                  onChange={(e: { target: { value: any } }) =>
                    setFieldValue('role', e.target.value)
                  }
                />
              </div>
              <div className="line" />

              <div className="mb-4">
                <label
                  className="block mb-2 font-bold"
                  htmlFor="experienceLevel">
                  Experience Level
                </label>
                <Field
                  as="select"
                  id="experienceLevel"
                  name="experienceLevel"
                  className="w-full p-2 border border-gray-300 rounded">
                  <option value="">Select Experience Level</option>
                  <option value="senior">Senior</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="junior">Junior</option>
                </Field>
                {/* <ErrorMessage
                  name="experienceLevel"
                  component="div"
                  className="text-red-500"
                /> */}
              </div>
              <div className="line" />

              <div className="mb-4">
                <label className="block mb-2 font-bold" htmlFor="remote">
                  Remote
                </label>
                <Field
                  as="select"
                  id="remote"
                  name="remote"
                  className="w-full p-2 border border-gray-300 rounded">
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
              <div className="line" />

              <Location
                locationTitle="Country"
                geoId={null}
                isCountry={true}
                onChange={(geoId) => {
                  setFieldValue('location.country.geoId', geoId)
                  setFieldValue('location.state', { name: '', geoId: null })
                  setFieldValue('location.city', { name: '', geoId: null })
                }}
              />
              <div className="line" />

              <Location
                locationTitle="State"
                geoId={values.location.country.geoId}
                isCountry={false}
                onChange={(geoId) => {
                  setFieldValue('location.state.geoId', geoId)
                  setFieldValue('location.city', { name: '', geoId: null })
                }}
              />
              <div className="line" />

              <Location
                locationTitle="City"
                geoId={values.location.state.geoId}
                isCountry={false}
                onChange={(geoId) => {
                  setFieldValue('location.city.geoId', geoId)
                }}
              />
              <div className="line" />
              <div className="btn">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
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
