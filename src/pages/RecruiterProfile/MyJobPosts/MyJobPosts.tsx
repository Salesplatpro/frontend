import Lottie from 'lottie-react'
import React from 'react'

import animationData from '../../../assets/Animation2.json'
import { Button } from '../../../components'
import Loading from '../../../components/Loading/Loading'
import { useFetchRecruiterJobPostQuery } from '../../../redux/api/recruiter'
import { JobsTable } from './JobsTable'
import styles from './MyJobPosts.module.scss'

export const MyJobPosts = () => {
  const { data, error, isLoading } = useFetchRecruiterJobPostQuery({})

  if (isLoading) {
    return <Loading />
  }

  // <div>Error loading job posts</div>

  if (error) {
    console.error(error)
    return (
      <div className="flex justify-center items-center flex-col w-full h-full">
        <div>
          <Lottie
            animationData={animationData}
            loop={false}
            className="w-28 h-28 lg:w-44 lg:h-44 md:w-36 md:h-36"
          />
        </div>

        <h2 className="font-raleway font-semibold text-center text-lg lg:text-2xl md:text-xl text-[#4b4b4b] pt-4">
          Error loading job posts
        </h2>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <div className={styles.titleDesc}>
          <div className={styles.title}>Job Posts</div>
          <div className={styles.desc}>
            {' '}
            View jobs posted by you and see number of applicants that have
            responded.
          </div>
        </div>
        <div style={{ width: '16%' }}>
          <Button title="Create New" textType="normal" />
        </div>
      </div>
      <div>
        <JobsTable data={data?.data || []} />
      </div>
    </div>
  )
}
