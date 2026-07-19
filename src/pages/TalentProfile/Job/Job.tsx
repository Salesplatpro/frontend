import './Job.scss'

import React, { useEffect, useState } from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { Bounce } from 'react-toastify'

import { EMPTY_LOCATION } from '@/components/forms/LocationSelect'
import { Spinner } from '@/components/ui/Spinner'

import { Button } from '../../../components'
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

const PAGE_SIZE = 10

const Job = () => {
  // State for filters
  const [filters, setFilters] = useState<JobFiltersTypes>(defaultFilterValues)
  const [showFilter, setShowFilter] = useState(false)
  const [jobs, setJobs] = useState<JobType[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const screenWidth = useScreenWidth()
  const isFiltered = hasActiveFilter(filters)

  // All active jobs, regardless of the viewer's own role — the backend has no
  // role restriction here, this is purely the default (unfiltered) listing.
  const { data, error, isLoading, isFetching } = useFetchJobQuery(
    { offset },
    { skip: isFiltered },
  )

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
    isFetching: isFilterFetching,
  } = useFilterJobQuery(
    {
      roleId: filters.role || '',
      experienceLevel: filters.experienceLevel || '',
      workMode: workModeFilter,
      city: filters.location?.city?.name || '',
      state: filters.location?.state?.name || '',
      country: filters.location?.country?.name || '',
      offset,
    },
    {
      skip: !isFiltered,
    },
  )

  // Handle initial/paginated data load
  useEffect(() => {
    if (data && !isFiltered) {
      const page: JobType[] = data.data.jobs
      setJobs((prev) => (offset === 0 ? page : [...prev, ...page]))
      setHasMore(page.length === PAGE_SIZE)
    }
    if (error) {
      notify('error', `Error fetching jobs`, {
        autoClose: 5000,
        transition: Bounce,
      })
    }
  }, [data, error, isFiltered])

  // Handle filtered/paginated data load
  useEffect(() => {
    if (filteredData && isFiltered) {
      const page: JobType[] = filteredData.data.jobs
      setJobs((prev) => (offset === 0 ? page : [...prev, ...page]))
      setHasMore(page.length === PAGE_SIZE)
    }
    if (filteredError) {
      notify('error', 'Error fetching filtered jobs', {
        autoClose: 5000,
        transition: Bounce,
      })
    }
  }, [filteredData, filteredError, isFiltered])

  const handleFilterSubmit = (filterValues: JobFiltersTypes) => {
    setOffset(0)
    setFilters(filterValues)
  }

  const handleLoadMore = () => {
    setOffset((prev) => prev + PAGE_SIZE)
  }

  const isInitialLoading = (isLoading || isFiltering) && offset === 0
  const isLoadingMore = (isFetching || isFilterFetching) && offset > 0

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
            {isInitialLoading ? (
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
              <p className="w-full text-center py-10">No job found</p>
            )}
          </div>
          {!isInitialLoading && hasMore && (
            <div className="flex justify-center py-6">
              <Button
                variant="secondary"
                onClick={handleLoadMore}
                disabled={isLoadingMore}>
                {isLoadingMore ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Job
