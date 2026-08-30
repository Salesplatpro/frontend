// import '../../../index.css'

import React, { useMemo, useState } from 'react'

import { DisplayError } from '@/components'
import { PageHero } from '@/components/layout/PageHero'
import { PageShell } from '@/components/layout/PageShell'
import { FilterFieldConfig, FilterPanel } from '@/components/ui/FilterPanel'
import { Spinner } from '@/components/ui/Spinner'
import { useScreenWidth } from '@/hooks'
import { useFetchRecruiterJobPostQuery } from '@/redux/api/recruiter'

import { recruiterJobPostsTypes } from '../../../utils'
import { JobsCardList } from './JobsCardList'
import { JobsTable } from './JobsTable'
import styles from './MyJobPosts.module.scss'
import { Pagination } from './Pagination'

const MOBILE_BREAKPOINT = 768

interface JobsFilterValues {
  search: string
}

const defaultJobsFilters: JobsFilterValues = { search: '' }

const JOBS_FILTER_FIELDS: FilterFieldConfig<JobsFilterValues>[] = [
  {
    type: 'search',
    key: 'search',
    label: 'Search',
    placeholder: 'Search by job title',
  },
]

export const MyJobPosts = () => {
  const { data, error, isLoading } = useFetchRecruiterJobPostQuery({})
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<JobsFilterValues>(defaultJobsFilters)
  const rowsPerPage = 7
  const screenWidth = useScreenWidth()

  const allJobs: recruiterJobPostsTypes[] = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.jobs)
    ? data.data.jobs
    : []

  const jobs = useMemo(() => {
    const query = filters.search.trim().toLowerCase()
    if (!query) return allJobs
    return allJobs.filter((job) => job.role.name.toLowerCase().includes(query))
  }, [allJobs, filters.search])

  const startIndex = (page - 1) * rowsPerPage
  const paginatedJobs = jobs.slice(startIndex, startIndex + rowsPerPage)

  const handleFiltersApply = (next: JobsFilterValues) => {
    setFilters(next)
    setPage(1)
  }

  if (isLoading) {
    return <Spinner fullPage />
  }

  if (error) {
    console.error(error)
    return <DisplayError message="Error loading jobs" />
  }

  return (
    <PageShell wide>
      <PageHero
        compact
        title="Job Posts"
        lead="View jobs posted by you and see number of applicants that have responded."
      />
      <div className={styles.layout}>
        <FilterPanel
          fields={JOBS_FILTER_FIELDS}
          filters={filters}
          defaultFilters={defaultJobsFilters}
          onApply={handleFiltersApply}
          ariaLabel="Filter job posts"
        />

        <div className={styles.mainColumn}>
          {screenWidth < MOBILE_BREAKPOINT ? (
            <JobsCardList data={paginatedJobs} />
          ) : (
            <JobsTable data={paginatedJobs} />
          )}
          <Pagination
            totalItems={jobs.length}
            itemsPerPage={rowsPerPage}
            currentPage={page}
            onPageChange={(newPage: React.SetStateAction<number>) =>
              setPage(newPage)
            }
          />
        </div>
      </div>
    </PageShell>
  )
}
