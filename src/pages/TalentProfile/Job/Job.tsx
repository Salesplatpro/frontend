import './Job.scss'

import React, { useEffect, useState } from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { Bounce } from 'react-toastify'

import { Spinner } from '@/components/ui/Spinner'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

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
  location: {
    city: { name: '', geoId: null },
    state: { name: '', geoId: null },
    country: { name: '', geoId: null },
  },
}

interface JobType {
  _id: string
  role: { name: string }
  experienceLevel: string
  description: string
  remote: boolean
  location: {
    country: string
  }
  maxSalary: string
}

const Job = () => {
  const user = useAuthStore((state) => state.user)
  const roleId = user?.profile?.role[0]?._id
  const { data, error, isLoading } = useFetchJobQuery(roleId)

  // State for filters
  const [filters, setFilters] = useState<JobFiltersTypes>(defaultFilterValues)
  const [showFilter, setShowFilter] = useState(false)
  const [jobs, setJobs] = useState<JobType[]>([])
  const screenWidth = useScreenWidth()

  // Fetch filtered jobs based on filters
  const {
    data: filteredData,
    error: filteredError,
    isLoading: isFiltering,
  } = useFilterJobQuery(
    {
      roleId: filters.role || '',
      experienceLevel: filters.experienceLevel || '',
      remote: filters.remote || '',
      city: filters.location?.city?.name || '',
      state: filters.location?.state?.name || '',
      country: filters.location?.country?.name || '',
    },
    {
      skip: !filters.role, // Skip the query if no role is selected
    },
  )

  // Handle initial data load
  useEffect(() => {
    if (data && !filters.role) {
      setJobs(data.data)
    }
    if (error) {
      notify('error', `DisplayError fetching jobs`, {
        autoClose: 5000,
        transition: Bounce,
      })
    }
  }, [data, error, filters.role])

  // Handle filtered data load
  useEffect(() => {
    if (filteredData && filters.role) {
      setJobs(filteredData.data)
      console.log(filteredData.data)
    }
    if (filteredError) {
      notify('error', 'DisplayError fetching filtered jobs', {
        autoClose: 5000,
        transition: Bounce,
      })
    }
  }, [filteredData, filteredError, filters.role])

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
                  jobId={job?._id}
                  jobTitle={job.role?.name}
                  jobCategory={job?.experienceLevel}
                  jobDescription={job?.description}
                  jobRemote={job?.remote}
                  jobCountry={job?.location?.country}
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
