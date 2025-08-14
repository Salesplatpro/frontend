import './JobFilter.scss'

import {  Field, Form, Formik } from 'formik'
import React, { Dispatch, SetStateAction, useState } from 'react'

import Location from '../../../components/global/Location'
import AllRoles from '../../../components/Roles/AllRoles'
import Worktype from '../../../components/Worktype'
import { useScreenWidth } from '../../../hooks'
import { useFetchProfileQuery } from '../../../redux/api/talent'
import { experienceLevel } from '../../../utils'
import { JobFiltersTypes } from '../../../utils/jobPostTypes'
WorkModeSelect'

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

  const [resetKey, setResetKey] = useState(0)

  const { data: userProfile } = useFetchProfileQuery({})

  const userInfo = userProfile?.data?.user
  const initialValues: JobFiltersTypes = {
    role: '',
    experienceLevel: '',
    // remote: '',
    location: {
      country: { name: '', geoId: null },
      state: { name: '', geoId: null },
      city: { name: '', geoId: null },
    },
    remote: userInfo?.profile?.remote || false,
    onSite: userInfo?.profile?.onSite || false,
    hybrid: userInfo?.profile?.hybrid || false,
  }

  const onSubmit = async (
    values: JobFiltersTypes,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setSubmitting(true)
    onFilterSubmit(values)

    console.log(values)
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
                onClick={() => {
                  setFieldValue('role', '')
                  setFieldValue('experienceLevel', '')
                  setFieldValue('remote', '')
                  setFieldValue('location', {
                    country: { name: '', geoId: null },
                    state: { name: '', geoId: null },
                    city: { name: '', geoId: null },
                  })
                  setResetKey((prev) => prev + 1) //remount AllRoles and Location
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
                <label className="block mb-2 font-bold" htmlFor="role">
                  Role
                </label>
                <div className="mt-2 rounded shadow-lg w-full">
                  <AllRoles
                    key={resetKey}
                    name="role"
                    value={values.role}
                    onChange={(value: any) => {
                      setFieldValue('role', value) // Update Formik state
                    }}
                    customHeight=""
                  />
                </div>
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
                  {Object.values(experienceLevel).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Field>
                {/* <ErrorMessage
                  name="experienceLevel"
                  component="div"
                  className="text-red-500"
                /> */}
              </div>
              <div className="line" />

              {/* <div className="mb-4">
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
              </div> */}

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

              <Location
                key={`country-${resetKey}`}
                locationTitle="Country"
                geoId={null}
                isCountry={true}
                onChange={(geoId) => {
                  setFieldValue('location.country.geoId', geoId)
                  setFieldValue('location.state', { name: '', geoId: null })
                  setFieldValue('location.city', { name: '', geoId: null })
                }}
                locationLabel={''}
                customHeight=""
              />
              <div className="line" />

              <Location
                key={`state-${resetKey}`}
                locationTitle="State"
                geoId={values.location?.country.geoId}
                isCountry={false}
                onChange={(geoId) => {
                  setFieldValue('location.state.geoId', geoId)
                  setFieldValue('location.city', { name: '', geoId: null })
                }}
                locationLabel={''}
                customHeight=""
              />
              <div className="line" />

              <Location
                key={`city-${resetKey}`}
                locationTitle="City"
                geoId={values.location?.state.geoId}
                isCountry={false}
                onChange={(geoId) => {
                  setFieldValue('location.city.geoId', geoId)
                }}
                locationLabel={''}
                customHeight=""
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
