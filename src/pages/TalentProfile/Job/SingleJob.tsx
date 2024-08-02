import './SingleJob.scss'

import React from 'react'
import { GoDotFill } from 'react-icons/go'
import { PiBuildingOfficeBold } from 'react-icons/pi'
import { Link } from 'react-router-dom'

import { Button } from '../../../components'
import { JobDetails } from './JobDetails'

export type SingleJobProps = {
  jobId: string
  jobTitle: string
  jobCategory: string
  jobDescription: string
  jobRemote?: string
  jobCountry?: string
  jobExperience?: string
  jobSalary?: string
  location?: {
    country: string
    state: string
    ciity: string
  }
  details?: {
    location: string
    type: string
    level: string
    salary: string
  }[]
}

export const SingleJob = ({
  jobId,
  jobTitle,
  jobCategory,
  jobDescription,
  jobRemote,
  jobExperience,
  jobCountry,
  jobSalary,
}: SingleJobProps) => {
  return (
    <div className="singlejob-container">
      <PiBuildingOfficeBold size={36} />
      <div className="title-container">
        <div className="jobtitle">
          <div className="title">{jobTitle}</div>
          <span className="category">
            <GoDotFill color="#2e90fa" />
            {jobCategory}
          </span>
        </div>
        <div className="description">{jobDescription}</div>
        <div className="details-container">
          <div className="jobdetails">
            <JobDetails
              location={jobCountry ?? 'Location not specified'}
              type={jobRemote ?? 'Type not specified'}
              level={jobExperience ?? 'Experience level not specified'}
              salary={jobSalary ?? 'Salary not specified'}

              // ?? 'Location not specified': This is the nullish coalescing operator (??). It checks if jobCountry is null or undefined. If it is, it will use the string 'Location not specified' as the default value
            />
          </div>
          <Link to={`/talentDashboard/job/${jobId}`}>
            <Button title="Apply Now" />
          </Link>
        </div>
      </div>
    </div>
  )
}
