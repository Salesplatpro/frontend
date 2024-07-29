import React from 'react'
import { Link } from 'react-router-dom'
import { PiBuildingOfficeBold } from 'react-icons/pi'
import { JobDetails } from './JobDetails'
import { Button } from '../../../components'
import './SingleJob.scss'
import { GoDotFill } from 'react-icons/go'

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
  // type: string
  // level: string
  // salary: string
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
              location={jobCountry}
              type={jobRemote}
              level={jobExperience}
              salary={jobSalary}
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
