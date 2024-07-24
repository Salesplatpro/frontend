import React, { useEffect, useState } from 'react'
import './Job.scss'
import { JobFilter } from './JobFilter'
import { SingleJob } from './SingleJob'
import { jobs } from './JobData'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { getScreenWidth } from '../../../hooks'
import { Button } from '../../../components'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store/store'
import { useFetchJobQuery } from '../../../redux/api/talent'
import toast from 'react-hot-toast'
import Loading from '../../../components/Loading/Loading'

export type JobFiltersTypes = {
  roles: string[]
  experienceLevel: string[]
  jobType: string[]
  location: string
  salary: [number, number]
}

const defaultFilterValues: JobFiltersTypes = {
  roles: [],
  experienceLevel: [],
  jobType: [],
  location: '',
  salary: [1000, 3000],
}

const Job = () => {
  const user = useSelector((state: RootState) => state.auth)
  const roleId = user.user.profile.role[0]._id
  const { data, error, isLoading } = useFetchJobQuery(roleId)

  const [filters, setFilters] = useState<JobFiltersTypes>(defaultFilterValues)
  const [showFilter, setShowFilter] = useState(false)
  const screenWidth = getScreenWidth()
  const minSalaryDifference = 1900
  console.log(filters)
  console.log(showFilter)

  useEffect(() => {
    if (data) {
      console.log(data.data)
    }
    if (error) {
      toast.error('Error fetching Job')
    }
  }, [data, error])

  const handleCountryChange = (countryName: string) => {
    setFilters({ ...filters, location: countryName })
  }

  const handleSalaryChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return
    }

    if (activeThumb === 0) {
      const newMin = Math.min(
        newValue[0],
        filters.salary[1] - minSalaryDifference,
      )
      setFilters({ ...filters, salary: [newMin, filters.salary[1]] })
    } else {
      const newMax = Math.max(
        newValue[1],
        filters.salary[0] + minSalaryDifference,
      )
      setFilters({ ...filters, salary: [filters.salary[0], newMax] })
    }
  }

  const handleRoleChange = (roleName: string) => {
    const newRole = filters.roles.includes(roleName)
      ? filters.roles.filter((role) => role !== roleName)
      : [...filters.roles, roleName]
    setFilters({ ...filters, roles: newRole })
  }

  const handleExperienceChange = (experience: string) => {
    const newExperience = filters.roles.includes(experience)
      ? filters.roles.filter((exp) => exp !== experience)
      : [...filters.experienceLevel, experience]
    setFilters({ ...filters, experienceLevel: newExperience })
  }

  const handleJobTypeChange = (jobType: string) => {
    const newJobType = filters.jobType.includes(jobType)
      ? filters.jobType.filter((job) => job !== jobType)
      : [...filters.jobType, jobType]
    setFilters({ ...filters, jobType: newJobType })
  }

  if (isLoading) return <Loading />

  return (
    <div className="job-container">
      <div className="jobs-title">
        <div className="jobs">Jobs</div>
        <div>Find your dream Job by searching and applying directly.</div>
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
          <JobFilter
            filters={filters}
            handleCountryChange={handleCountryChange}
            handleSalaryChange={handleSalaryChange}
            handleRoleChange={handleRoleChange}
            handleExperienceChange={handleExperienceChange}
            handleJobTypeChange={handleJobTypeChange}
            onClose={() => setShowFilter(!showFilter)}
          />
        )}
        <div className="job-listing-container">
          <div className="sorting">
            <div className="showing-result">Showing 400 results</div>
            <div className="sortby">
              Sort by: Recent{' '}
              <span>
                <MdKeyboardArrowDown />
              </span>
            </div>
          </div>
          <div className="job-listing">
            {jobs.map((job, index) => (
              <SingleJob
                key={index}
                jobTitle={job.jobTitle}
                jobCategory={job.jobCategory}
                jobDescription={job.jobDescription}
                details={job.details}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Job
