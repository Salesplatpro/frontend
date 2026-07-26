import React from 'react'

import profile from '../../../assets/profile.jpeg'
import { StatusBadge } from '../../../components'
import { capitalizeEachWord } from '../../../utils/CapitalizeWord'
import { getStatusBadge } from '../getJobStatus'
import styles from './ProfileCard.module.scss'

type ProfileCardProps = {
  firstName: string
  lastName: string
  role: string
  description: string
  jobStatus: string
}

export const ProfileCard = ({
  firstName,
  lastName,
  role,
  description,
  jobStatus,
}: ProfileCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.identity}>
        <div className={styles.avatar}>
          <img src={profile} alt="profile" className={styles.avatarImage} />
        </div>
        <div className={styles.details}>
          <div className={styles.name}>
            {firstName} {lastName}
          </div>
          <div className={styles.role}>{capitalizeEachWord(role)}</div>
          <div className={styles.experience}>5 years</div>
          <StatusBadge status={jobStatus} {...getStatusBadge(jobStatus)} />
        </div>
      </div>
      <div className={styles.description}>{description}</div>
    </div>
  )
}
