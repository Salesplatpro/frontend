import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../../index.css'

import { DisplayError } from '../../../components'
import Loading from '../../../components/Loading/Loading'
import { useFetchRecruiterJobPostQuery } from '../../../redux/api/recruiter'
import { JobsTable } from './JobsTable'
import styles from './MyJobPosts.module.scss'
import { Pagination } from './Pagination'

export const MyJobPosts = () => {
  const { data, error, isLoading } = useFetchRecruiterJobPostQuery({})
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const rowsPerPage = 5

  const jobs = data?.data || []
  const startIndex = (page - 1) * rowsPerPage
  const paginatedJobs = jobs.slice(startIndex, startIndex + rowsPerPage)

  if (isLoading) {
    return <Loading />
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
          <div className="text-[15px] w-[280px] lg:text-[18px] lg:w-full md:w-full md:text-[16px] sm:w-[350px] sm:text-[16px]">
            View jobs posted by you and see number of applicants that have
            responded.
          </div>
        </div>
        <div className="w-[25%] lg:w-[12%] md:w-[17%] sm:w-[17%]">
          <button
            className="text-[#ffffff] font-raleway font-semibold whitespace-nowrap flex lg:text-[14px] leading-[28px] py-1 px-3 
            bg-[#3C6FD4] rounded-lg"
            onClick={() => navigate('/recruiterDashboard/postjob')}>
            Create New
          </button>
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
