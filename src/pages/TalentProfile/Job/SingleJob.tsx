import './SingleJob.scss'

import React from 'react'
import { GoDotFill } from 'react-icons/go'
import { PiBuildingOfficeBold } from 'react-icons/pi'
import { Link } from 'react-router-dom'

import { Button } from '../../../components'
import Loading from '../../../components/Loading/Loading'
import { capitalizeFirstWord } from '../../../utils'
import { JobDetails } from './JobDetails'

export type SingleJobProps = {
  jobId?: string
  jobTitle?: string
  jobCategory?: string
  jobDescription?: string
  jobRemote?: boolean
  jobCountry?: string
  jobExperience?: string
  jobSalary?: string
  isFiltering?: boolean
  isLoading?: boolean
  location?: {
    city: { name: ''; geoId: null }
    state: { name: ''; geoId: null }
    country: { name: ''; geoId: null }
  }
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
  isFiltering,
  isLoading,
}: SingleJobProps) => {
  if (isFiltering || isLoading) return <Loading />

  return (
    <div className="singlejob-container">
      <PiBuildingOfficeBold size={36} />
      <div className="title-container">
        <Link to={`/talentDashboard/job/${jobId}`} className="jobTitle">
          <div className="title">{capitalizeFirstWord(jobTitle)}</div>
          <span className="category">
            <GoDotFill color="#2e90fa" />
            {capitalizeFirstWord(jobCategory)}
          </span>
        </Link>
        <div className="description">{jobDescription}</div>
        <div className="details-container">
          <div className="jobdetails">
            <JobDetails
              location={capitalizeFirstWord(jobCountry || '')}
              type={jobRemote}
              level={capitalizeFirstWord(jobExperience) || ''}
              salary={jobSalary || ''}
            />
          </div>
          <Link to={`/talentDashboard/job/${jobId}`}>
            <Button title="Apply Now" textType="normal" />
          </Link>
        </div>
      </div>
    </div>
  )
}
