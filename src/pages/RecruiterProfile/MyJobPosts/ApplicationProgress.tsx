import React from 'react'
import { CgInfo } from 'react-icons/cg'
import { GoTasklist } from 'react-icons/go'
import { SiReaddotcv } from 'react-icons/si'
import { TbEdit } from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router-dom'

import Loading from '../../../components/Loading/Loading'
import { useFetchApplicantProgressQuery } from '../../../redux/api/recruiter'
import styles from './applicationProgress.module.scss'

export const ApplicationProgress = () => {
  const navigate = useNavigate()
  const { applicationId } = useParams()
  const iconSize = 32
  const iconColor = ' #4985df'
  const { data, error, isLoading } = useFetchApplicantProgressQuery(
    applicationId ?? '',
  )

  const progress = [
    {
      icon: <GoTasklist size={iconSize} color={iconColor} />,
      title: 'Pre-Assessment',
      score: 60,
    },
    {
      icon: <SiReaddotcv size={iconSize} color={iconColor} />,
      title: 'CV-Matching',
      score: data?.data?.application?.cvSimilarityScore,
    },
    {
      icon: <TbEdit size={iconSize} color={iconColor} />,
      title: 'Personality Test',
      score: 60,
    },
    {
      icon: <TbEdit size={iconSize} color={iconColor} />,
      title: 'Personalized Test',
    },
  ]

  if (error) {
    return <div>Error loading job details</div>
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div>
      <div className={styles.titleDesc}>
        <div className={styles.title}>
          {data?.data?.application?.talent.firstName}{' '}
          {data?.data?.application?.talent.lastName}
        </div>
        <div className={styles.desc}>
          {' '}
          View jobs posted by you and see number of applicants that have
          responded.
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.info}>
          <CgInfo size={28} color="#ff9500" />
          <div>Assessment</div>
        </div>
      </div>
      {progress.map((item, index) => (
        <div key={index} className={styles.progressContainer}>
          <div className={styles.iconTitle}>
            <div className={styles.icon}>{item.icon}</div>
            <div className={styles.title}>{item.title}</div>
          </div>
          <div className={styles.score}>
            {item.score ? (
              <div>
                {`${item.score}%`}
                <span className={styles.scoreItem}>Match</span>
              </div>
            ) : (
              <div className={styles.noMatch}>Match</div>
            )}
          </div>
        </div>
      ))}
      <div onClick={() => navigate(-1)} className={styles.button}>
        Back to Homepage
      </div>
    </div>
  )
}
