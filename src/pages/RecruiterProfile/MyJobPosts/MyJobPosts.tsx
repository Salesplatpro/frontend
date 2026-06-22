// import '../../../index.css'

import React, { useState } from 'react'

import { DisplayError } from '@/components'
import { Spinner } from '@/components/ui/Spinner'
import { useFetchRecruiterJobPostQuery } from '@/redux/api/recruiter'

import { JobsTable } from './JobsTable'
import styles from './MyJobPosts.module.scss'
import { Pagination } from './Pagination'

export const MyJobPosts = () => {
  const { data, error, isLoading } = useFetchRecruiterJobPostQuery({})
  const [page, setPage] = useState(1)
  const rowsPerPage = 7

  const jobs = data?.data || []
  const startIndex = (page - 1) * rowsPerPage
  const paginatedJobs = jobs.slice(startIndex, startIndex + rowsPerPage)

  if (isLoading) {
    return <Spinner fullPage />
  }

  if (error) {
    console.error(error)
    return <DisplayError message="Error loading jobs" />
  }

  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <div className={styles.titleDesc}>
          <div className={styles.title}>Job Posts</div>
          <div className="text-[15px] w-[220px] flex flex-nowrap lg:text-[18px] lg:w-full md:w-full md:text-[16px] sm:w-[350px] sm:text-[16px]">
            View jobs posted by you and see number of applicants that have
            responded.
          </div>
        </div>
      </div>
      <div>
        <JobsTable data={paginatedJobs} />
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
  )
}
