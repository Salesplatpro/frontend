import React, { useEffect, useState } from 'react'

import { EmptyState } from '@/components/ui/EmptyState'
import { DisplayError } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { Heading, Text } from '@/components/ui/Typography'

import { Button } from '../../../components'
import {
  useAllJobApplicationsQuery,
  useFetchJobsQuery,
} from '../../../redux/api/talent'
import { JobFiltersTypes } from '../../../utils/jobPostTypes'
import { notify } from '../../../utils/toastNotifications'
import { AllJobTypes } from '../../../utils/types'
import styles from './Job.module.scss'
import { ActiveFilterChips, defaultFilterValues, JobFilter } from './JobFilter'
import { SingleJob } from './SingleJob'

interface JobType {
  id: string
  role: { name: string }
  experienceLevel: string
  jobBrief: string
  workMode: string[]
  locationCountry: string | null
  maxSalary: string
}

const PAGE_SIZE = 10

const Job = () => {
  const [filters, setFilters] = useState<JobFiltersTypes>(defaultFilterValues)
  const [jobs, setJobs] = useState<JobType[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  const { data, error, isLoading, isFetching } = useFetchJobsQuery({
    roleId: filters.role || undefined,
    experienceLevel: filters.experienceLevel || undefined,
    workMode: filters.workMode?.length ? filters.workMode.join(',') : undefined,
    city: filters.location?.city?.name || undefined,
    state: filters.location?.state?.name || undefined,
    country: filters.location?.country?.name || undefined,
    offset,
  })

  const { data: applicationsData } = useAllJobApplicationsQuery({})
  const appliedJobIds = new Set(
    (applicationsData?.data?.applications as AllJobTypes[] | undefined)
      ?.map((application) => application.job?.id)
      .filter(Boolean),
  )

  useEffect(() => {
    if (!data) return
    const page: JobType[] = data.data.jobs
    setJobs((prev) => (offset === 0 ? page : [...prev, ...page]))
    setHasMore(page.length === PAGE_SIZE)
  }, [data, offset])

  useEffect(() => {
    if (error) {
      notify('error', 'Error fetching jobs')
    }
  }, [error])

  const handleFilterApply = (nextFilters: JobFiltersTypes) => {
    setOffset(0)
    setFilters(nextFilters)
  }

  const handleLoadMore = () => setOffset((prev) => prev + PAGE_SIZE)

  const isInitialLoading = isLoading && offset === 0
  const isLoadingMore = isFetching && offset > 0

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Heading level={1}>Jobs</Heading>
        <Text color="primary" className={styles.subtitle}>
          Find your dream job by searching and applying directly.
        </Text>
      </div>

      <div className={styles.section}>
        <JobFilter filters={filters} onApply={handleFilterApply} />

        <div className={styles.listing}>
          <div className={styles.resultsRow}>
            <span className={styles.resultsCount}>
              Showing {jobs.length} result{jobs.length === 1 ? '' : 's'}
            </span>
          </div>

          <ActiveFilterChips filters={filters} onChange={handleFilterApply} />

          {isInitialLoading ? (
            <Spinner fullPage />
          ) : jobs.length > 0 ? (
            <div className={styles.jobList}>
              {jobs.map((job) => (
                <SingleJob
                  key={job.id}
                  jobId={job.id}
                  jobTitle={job.role?.name}
                  jobCategory={job.experienceLevel}
                  jobBrief={job.jobBrief}
                  jobWorkMode={job.workMode}
                  jobCountry={job.locationCountry ?? undefined}
                  jobExperience={job.experienceLevel}
                  jobSalary={job.maxSalary}
                  isApplied={appliedJobIds.has(job.id)}
                />
              ))}
            </div>
          ) : error ? (
            <DisplayError message="We couldn't load jobs. Please try again." />
          ) : (
            <EmptyState
              title="No jobs found"
              description="Try adjusting your filters or check back later for new openings."
            />
          )}

          {!isInitialLoading && hasMore && (
            <div className={styles.loadMore}>
              <Button
                variant="secondary"
                onClick={handleLoadMore}
                loading={isLoadingMore}>
                Load More
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Job
