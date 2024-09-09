import './Job.scss'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { useSelector } from 'react-redux'

import { Button } from '../../../components'
import Loading from '../../../components/Loading/Loading'
import { useScreenWidth } from '../../../hooks'
import { useFetchJobQuery, useFilterJobQuery } from '../../../redux/api/talent'
import { RootState } from '../../../redux/store/store'
import { JobFiltersTypes } from '../../../utils/jobPostTypes'
import { JobFilter } from './JobFilter'
import { SingleJob } from './SingleJob'

const defaultFilterValues: JobFiltersTypes = {
  role: '',
  experienceLevel: '',
  remote: '', // Ensure this is valid per JobFiltersTypes
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
  const user = useSelector((state: RootState) => state.auth)
  const roleId = user?.user?.profile?.role[0]?._id
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
      console.log(data.data)
    }
    if (error) {
      toast.error('DisplayError fetching jobs')
    }
  }, [data, error, filters.role])

  // Handle filtered data load
  useEffect(() => {
    if (filteredData && filters.role) {
      setJobs(filteredData.data)
      console.log(filteredData.data)
    }
    if (filteredError) {
      toast.error('DisplayError fetching filtered jobs')
    }
  }, [filteredData, filteredError, filters.role])

  // if (isLoading || isFiltering) return <Loading />
  // if (isFiltering) return <Loading />

  const handleFilterSubmit = (filterValues: JobFiltersTypes) => {
    // setJobs([])
    setFilters(filterValues)
    setShowFilter(false)
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
              title="Open filters"
              variant="secondary"
              onClick={() => setShowFilter(!showFilter)}
            />
          </div>
        ) : (
          <JobFilter onFilterSubmit={handleFilterSubmit} />
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
            {(isLoading || isFiltering) && <Loading />}
            {jobs.map((job, index) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Job
