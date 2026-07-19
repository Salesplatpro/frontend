import './Job.scss'

import React, { useEffect, useState } from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { Bounce } from 'react-toastify'

import { EMPTY_LOCATION } from '@/components/forms/LocationSelect'
import { Spinner } from '@/components/ui/Spinner'

import { Button, DisplayError } from '../../../components'
import { useScreenWidth } from '../../../hooks'
import { useFetchJobQuery, useFilterJobQuery } from '../../../redux/api/talent'
import { JobFiltersTypes } from '../../../utils/jobPostTypes'
import { notify } from '../../../utils/toastNotifications'
import { JobFilter } from './JobFilter'
import { SingleJob } from './SingleJob'

const defaultFilterValues: JobFiltersTypes = {
  role: '',
  experienceLevel: '',
  remote: false,
  onSite: false,
  hybrid: false,
  location: { ...EMPTY_LOCATION },
}

interface JobType {
  id: string
  role: { name: string }
  experienceLevel: string
  jobBrief: string
  workMode: string[]
  locationCountry: string | null
  maxSalary: string
}

// A filter is "active" only once the talent has actually touched a field —
// used to decide whether the filtered query should run at all.
const hasActiveFilter = (filters: JobFiltersTypes) =>
  !!(
    filters.role ||
    filters.experienceLevel ||
    filters.remote ||
    filters.onSite ||
    filters.hybrid ||
    filters.location?.city?.name ||
    filters.location?.state?.name ||
    filters.location?.country?.name
  )

const Job = () => {
  // All active jobs, regardless of the viewer's own role — the backend has no
  // role restriction here, this is purely the default (unfiltered) listing.
  const { data, error, isLoading } = useFetchJobQuery(undefined)

  // State for filters
  const [filters, setFilters] = useState<JobFiltersTypes>(defaultFilterValues)
  const [showFilter, setShowFilter] = useState(false)
  const [jobs, setJobs] = useState<JobType[]>([])
  const screenWidth = useScreenWidth()
  const isFiltered = hasActiveFilter(filters)

  const workModeFilter = [
    filters.remote && 'remote',
    filters.onSite && 'onSite',
    filters.hybrid && 'hybrid',
  ]
    .filter(Boolean)
    .join(',')

  // Fetch filtered jobs based on filters
  const {
    data: filteredData,
    error: filteredError,
    isLoading: isFiltering,
  } = useFilterJobQuery(
    {
      roleId: filters.role || '',
      experienceLevel: filters.experienceLevel || '',
      workMode: workModeFilter,
      city: filters.location?.city?.name || '',
      state: filters.location?.state?.name || '',
      country: filters.location?.country?.name || '',
    },
    {
      skip: !isFiltered,
    },
  )

  // Handle initial data load
  useEffect(() => {
    if (data && !isFiltered) {
      setJobs(data.data.jobs)
    }
    if (error) {
      notify('error', `DisplayError fetching jobs`, {
        autoClose: 5000,
        transition: Bounce,
      })
    }
  }, [data, error, isFiltered])

  // Handle filtered data load
  useEffect(() => {
    if (filteredData && isFiltered) {
      setJobs(filteredData.data.jobs)
    }
    if (filteredError) {
      notify('error', 'DisplayError fetching filtered jobs', {
        autoClose: 5000,
        transition: Bounce,
      })
    }
  }, [filteredData, filteredError, isFiltered])

  const handleFilterSubmit = (filterValues: JobFiltersTypes) => {
    setFilters(filterValues)
  }

  return (
    <div className="job-container">
      <div className="jobs-title">
        <div className="jobs">Jobs</div>
        <div>Find your dream job by searching and applying directly.</div>
      </div>
      <div className="job-section">
        {screenWidth < 768 && !showFilter ? (
          <div style={{ height: '100px' }}>
            <Button
              variant="secondary"
              onClick={() => setShowFilter(!showFilter)}>
              Open filters
            </Button>
          </div>
        ) : (
          <JobFilter
            showFilter={showFilter}
            setShowFilter={setShowFilter}
            onFilterSubmit={handleFilterSubmit}
          />
        )}
        <div className="job-listing-container">
          <div className="sorting">
            <div className="showing-result">Showing {jobs.length} results</div>
            <div className="sortby">
              Sort by: Recent{' '}
              <span>
                <MdKeyboardArrowDown />
              </span>
            </div>
          </div>
          <div className="job-listing">
            {isLoading || isFiltering ? (
              <Spinner fullPage />
            ) : jobs.length > 0 ? (
              jobs.map((job, index) => (
                <SingleJob
                  key={index}
                  jobId={job?.id}
                  jobTitle={job.role?.name}
                  jobCategory={job?.experienceLevel}
                  jobBrief={job?.jobBrief}
                  jobWorkMode={job?.workMode}
                  jobCountry={job?.locationCountry ?? undefined}
                  jobExperience={job?.experienceLevel}
                  jobSalary={job?.maxSalary}
                  isFiltering={isFiltering}
                  isLoading={isLoading}
                />
              ))
            ) : (
              <DisplayError message="No job found" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Job
