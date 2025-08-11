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

    const FacebookshareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      link,
    )}`

    const LinkedInshareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
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
            <TableCell
              align={align}
              sx={tableHeadStyle}
              className="border-l border-[#b5b4b4]">
              Applicants
            </TableCell>
            <TableCell
              align={align}
              sx={tableHeadStyle}
              className="whitespace-nowrap border-l border-[#b5b4b4]">
              Date Creation
            </TableCell>
            <TableCell
              align={align}
              sx={tableHeadStyle}
              className="border-l border-[#b5b4b4]">
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
                <Link
                  to={`/recruiterDashboard/jobdetail/${job._id}`}
                  className="block max-w-[280px] text-left truncate">
                  {job.role.name}
                </Link>
              </TableCell>
              <TableCell align={align} sx={tableCellStyle}>
                <Link
                  to={`/recruiterDashboard/singleJobPost/${job._id}`}
                  state={{ jobName: job.role.name, postedAt: job.createdAt }}>
                  <button className="text-[#3C6FD4] font-raleway font-semibold text-[16px] leading-[28px] underline">
                    View ({job.noOfApplicants})
                  </button>
                </Link>
              </TableCell>
              <TableCell align={align} sx={tableCellStyle}>
                <p className="whitespace-nowrap">{`${calculateDaysFromCreation(
                  job.createdAt,
                )} days ago`}</p>
              </TableCell>
              <TableCell align={align} sx={tableCellStyle}>
                <div className="flex items-center justify-center md:space-x-2">
                  <Link
                    to={`/recruiterDashboard/jobdetail/${job._id}`}
                    state={{ jobName: job.role.name, postedAt: job.createdAt }}>
                    <button
                      className="text-[#ffffff] font-raleway font-semibold whitespace-nowrap flex text-[14px] leading-[28px] py-1 px-3 
                    bg-[#3C6FD4] rounded-lg">
                      View Job
                    </button>
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
