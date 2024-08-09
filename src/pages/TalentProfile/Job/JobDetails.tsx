import './JobDetails.scss'

import React from 'react'
// eslint-disable-next-line no-unused-vars
import { GoClock, GoLocation } from 'react-icons/go'
import { IoBagRemoveOutline } from 'react-icons/io5'
import { TbMoneybag } from 'react-icons/tb'

type JobDetailsProps = {
  location?: string
  type?: boolean
  level?: string
  salary?: string
}

export const JobDetails = ({
  location,
  type,
  level,
  salary,
}: JobDetailsProps) => {
  const details = [
    {
      icon: <GoLocation />,
      detail: location,
    },
    // {
    //   icon: <GoClock />,
    //   detail: type
    // },
    {
      icon: <IoBagRemoveOutline />,
      detail: level,
    },
    {
      icon: <TbMoneybag />,
      detail: salary,
    },
  ]
  return (
    <div className="job-details-container">
      {details.map((detail, index) => (
        <div className="job-detail" key={index}>
          <div>{detail.icon}</div>
          <div>{detail.detail}</div>
        </div>
      ))}
    </div>
  )
}
