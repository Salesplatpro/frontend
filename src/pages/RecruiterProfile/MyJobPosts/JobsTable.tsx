import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '../../../components/Button'
import { ShareOptions } from '../../../components/ShareOption/ShareOptions'
import {
  calculateDaysFromCreation,
  recruiterJobPostsTypes,
} from '../../../utils'
import ShareJobModal from '../../TalentProfile/Job/ShareJobModal'

type JobsTableType = {
  data: recruiterJobPostsTypes[]
}

const tableHeadStyle = {
  color: '#101828',
  backgroundColor: '#F8F8F8',
  fontSize: '18px',
  fontFamily: 'Raleway, sans-serif',
  fontWeight: 600,
}

const tableCellStyle = {
  color: '#101828',
  fontSize: '16px',
  fontFamily: 'Raleway, sans-serif',
  fontWeight: 600,
}

export const JobsTable = ({ data }: JobsTableType) => {
  const align = 'center'
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [shareLinks, setShareLinks] = useState<{
    facebook: string
    twitter: string
    linkedin: string
  }>({
    facebook: '',
    twitter: '',
    linkedin: '',
  })

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleShare = (jobId: string) => {
    const link = `https://auxhr.com/job/postedjob/${jobId}`
    const TwittershareUrl = `https://twitter.com/share?url=${encodeURIComponent(
      link,
    )}`
    const FacebookshareUrl = `https://facebook.com/share?url=${encodeURIComponent(
      link,
    )}`
    const LinkedInshareUrl = `https://linkedin.com/share?url=${encodeURIComponent(
      link,
    )}`

    setShareLinks({
      facebook: FacebookshareUrl,
      twitter: TwittershareUrl,
      linkedin: LinkedInshareUrl,
    })
    setIsModalOpen(true)
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="Application pipeline data">
        <TableHead>
          <TableRow>
            <TableCell align={align} sx={tableHeadStyle}>
              Job Title
            </TableCell>
            <TableCell align={align} sx={tableHeadStyle}>
              Applicants
            </TableCell>
            <TableCell align={align} sx={tableHeadStyle}>
              Date Creation
            </TableCell>
            <TableCell align={align} sx={tableHeadStyle}>
              Details
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((job, index) => (
            <TableRow key={index}>
              <TableCell
                component="th"
                align={align}
                sx={tableCellStyle}
                className="capitalize">
                {job.role.name}
              </TableCell>
              <TableCell align={align} sx={tableCellStyle}>
                {job.noOfApplicants}
              </TableCell>
              <TableCell align={align} sx={tableCellStyle}>
                {`${calculateDaysFromCreation(job.createdAt)} days ago`}
              </TableCell>
              <TableCell align={align} sx={tableCellStyle}>
                <div className="flex items-center justify-center md:space-x-2">
                  <Link
                    to={`/recruiterDashboard/singleJobPost/${job._id}`}
                    state={{ jobName: job.role.name, postedAt: job.createdAt }}>
                    <Button title="View" />
                  </Link>
                  <ShareOptions handleShare={handleShare} jobId={job._id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isModalOpen && (
        <ShareJobModal onClose={closeModal} shareLinks={shareLinks} />
      )}
    </TableContainer>
  )
}
