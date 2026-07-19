import './SingleJob.scss'

import React from 'react'
import { GoDotFill } from 'react-icons/go'
import { PiBuildingOfficeBold } from 'react-icons/pi'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

import { capitalizeFirstWord } from '../../../utils'
import { JobDetails } from './JobDetails'

const stripHtmlAndTruncate = (html: string, limit: number) => {
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > limit ? `${text.slice(0, limit)}...` : text
}

export type SingleJobProps = {
  jobId?: string
  jobTitle?: string
  jobCategory?: string
  jobBrief?: string
  jobWorkMode?: string[]
  jobCountry?: string
  jobExperience?: string
  jobSalary?: string
  isFiltering?: boolean
  isLoading?: boolean
}

export const SingleJob = ({
  jobId,
  jobTitle,
  jobCategory,
  jobBrief,
  jobWorkMode,
  jobExperience,
  jobCountry,
  jobSalary,
  isFiltering,
  isLoading,
}: SingleJobProps) => {
  if (isFiltering || isLoading) return <Spinner fullPage />

  return (
    <div className="singlejob-container">
      <PiBuildingOfficeBold size={36} />
      <div className="title-container">
        <Link to={`/talentDashboard/job/${jobId}`} className="jobTitle">
          <div className="title text-black font-raleway">
            {capitalizeFirstWord(jobTitle)}
          </div>
          <span className="category">
            <GoDotFill color="#2e90fa" />
            {capitalizeFirstWord(jobCategory)}
          </span>
        </Link>
        {jobBrief && (
          <div className="description">
            {stripHtmlAndTruncate(jobBrief, 140)}
          </div>
        )}
        <div className="details-container">
          <div className="jobdetails">
            <JobDetails
              location={capitalizeFirstWord(jobCountry || '')}
              type={jobWorkMode?.map(capitalizeFirstWord).join(', ')}
              level={capitalizeFirstWord(jobExperience) || ''}
              salary={jobSalary || ''}
            />
          </div>
          <Link to={`/talentDashboard/job/${jobId}`}>
            <Button>Apply Now</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
