import React from 'react'
import { GoClock, GoLocation } from 'react-icons/go'
import { IoBagRemoveOutline } from 'react-icons/io5'
import { TbMoneybag } from 'react-icons/tb'

import styles from './JobDetails.module.scss'

type JobDetailsProps = {
  location?: string
  type?: string
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
    { icon: <GoLocation />, detail: location },
    { icon: <GoClock />, detail: type },
    { icon: <IoBagRemoveOutline />, detail: level },
    { icon: <TbMoneybag />, detail: salary },
  ].filter((item) => item.detail)

  return (
    <div className={styles.container}>
      {details.map((detail, index) => (
        <div className={styles.detail} key={index}>
          <div>{detail.icon}</div>
          <div>{detail.detail}</div>
        </div>
      ))}
    </div>
  )
}
