import React, { useState } from 'react'
import { IoFilterOutline } from 'react-icons/io5'

import { useFetchRecruiterJobPostQuery } from '@/redux/api/recruiter'

import styles from './FilterByJobs.module.scss'

interface FilterByJobsProps {
  onFilter: (jobId: string) => void
}

interface Job {
  id: string
  role: {
    name: string
  }
}

const FilterByJobs: React.FC<FilterByJobsProps> = ({ onFilter }) => {
  const { data: jobData, error, isLoading } = useFetchRecruiterJobPostQuery({})
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const handleFilterSelect = (jobId: string) => {
    onFilter(jobId)
    setDropdownVisible(false)
  }

  return (
    <div className={styles.wrapper}>
      <button
        onClick={() => setDropdownVisible(!dropdownVisible)}
        className={styles.trigger}>
        <IoFilterOutline />
        <span className={styles.label}>Filters</span>
      </button>

      {dropdownVisible && (
        <div className={styles.menu}>
          {isLoading ? (
            <p className={styles.state}>Loading jobs...</p>
          ) : error ? (
            <p className={`${styles.state} ${styles.error}`}>
              Error loading jobs
            </p>
          ) : (
            jobData?.data?.map((job: Job) => (
              <div
                key={job.id}
                onClick={() => handleFilterSelect(job.id)}
                className={styles.item}>
                {job.role.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default FilterByJobs
