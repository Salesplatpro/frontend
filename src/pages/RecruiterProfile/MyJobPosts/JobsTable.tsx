import 'react-responsive-modal/styles.css'

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
import { Modal } from 'react-responsive-modal'
import { Link } from 'react-router-dom'

import { ShareOptions } from '@/components/features/jobs/ShareOption/ShareOptions'

import Facebook from '../../../assets/Facebook icon.svg'
import LinkedIn from '../../../assets/linkedin logo_icon.svg'
import Twitter from '../../../assets/twitter_new_brand_icon.svg'
import {
  calculateDaysFromCreation,
  recruiterJobPostsTypes,
} from '../../../utils'

type JobsTableType = {
  data: recruiterJobPostsTypes[]
}

const tableHeadStyle = {
  color: 'var(--color-grey-900)',
  backgroundColor: 'var(--color-grey-50)',
  fontSize: '18px',
  fontFamily: 'Raleway, sans-serif',
  fontWeight: 600,
}

const tableCellStyle = {
  color: 'var(--color-grey-900)',
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

  const shareOptions = [
    {
      icon: Facebook,
      text: 'Share',
      action: 'share',
      link: shareLinks.facebook,
    },

    {
      icon: Twitter,
      text: 'Tweet',
      action: 'share',
      link: shareLinks.twitter,
    },
    {
      icon: LinkedIn,
      text: 'Share',
      action: 'share',
      link: shareLinks.linkedin,
    },
  ]

  const handleRedirectShare = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer')
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
              className="border-l border-[#b5b4b4]"
            >
              Applicants
            </TableCell>
            <TableCell
              align={align}
              sx={tableHeadStyle}
              className="whitespace-nowrap border-l border-[#b5b4b4]"
            >
              Date Creation
            </TableCell>
            <TableCell
              align={align}
              sx={tableHeadStyle}
              className="border-l border-[#b5b4b4]"
            >
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
                className="capitalize"
              >
                <Link
                  to={`/recruiterDashboard/jobdetail/${job._id}`}
                  className="block max-w-[280px] text-left truncate text-black font-raleway"
                >
                  {job.role.name}
                </Link>
              </TableCell>
              <TableCell align={align} sx={tableCellStyle}>
                <Link
                  to={`/recruiterDashboard/singleJobPost/${job._id}`}
                  state={{ jobName: job.role.name, postedAt: job.createdAt }}
                >
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
                    state={{ jobName: job.role.name, postedAt: job.createdAt }}
                  >
                    <button
                      className="text-[#ffffff] font-raleway font-semibold whitespace-nowrap flex text-[14px] leading-[28px] py-1 px-3 
                    bg-[#3C6FD4] rounded-lg"
                    >
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

      <Modal open={isModalOpen} onClose={closeModal} center>
        <div className="flex flex-col items-center text-center rounded-lg p-6 max-w-[400px] min-w-[280px] mx-auto">
          <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-medium font-raleway">
            Select your preferred social media to share job
          </h2>

          <div className="mt-4 w-full">
            {shareOptions.map((option, index) => (
              <button
                key={index}
                className="w-full border-[1px] py-3 my-2 rounded-lg font-raleway text-[14px] sm:text-[16px] md:text-[18px] bg-white border-[#E7E7E9] hover:bg-[#e8eaee] flex items-center justify-center"
                onClick={() => handleRedirectShare(option.link)}
              >
                <img
                  src={option.icon}
                  alt={option.text}
                  className="mr-3 w-[28px] h-[28px] object-contain"
                />
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </TableContainer>
  )
}
