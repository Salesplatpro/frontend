import React from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { useNavigate, useParams } from 'react-router-dom'

import { ChooseMethodCard } from '@/components/features/recruiter/Cards'
import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { useGetCampaignNameQuery } from '@/redux/api/recruiter'

import { Button } from '../../../components'
import styles from './chooseMethod.module.scss'

const description = (
  <div>
    <span>Click to upload</span> or drag and drop PDF or Word documents
  </div>
)

export const ChooseMethod = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useGetCampaignNameQuery(params, {
    skip: !params.id,
  })

  if (isLoading) {
    return <Spinner fullPage />
  }

  if (isError || !data?.data) {
    return (
      <EmptyState
        title="Scout job not found"
        description="This scout job doesn't exist or you don't have access to it."
        action={
          <Button
            variant="primary"
            onClick={() => navigate('/recruiterDashboard/scout')}>
            Back to My Scout Jobs
          </Button>
        }
      />
    )
  }

  const chooseMethodArray = [
    {
      id: 1,
      name: 'Upload CVs',
      description,
      icon: <AiOutlineCloudUpload size={20} />,
      link: `/recruiterDashboard/scout/upload-cv/${params.id}`,
    },
  ]

  return (
    <div className={styles.topContainer}>
      <PageHeaderTitle
        paramsId={params}
        description="Choose how you'd like to scout talent for this job"
        onBack={() => navigate(-1)}
      />
      <div className={styles.parent}>
        {chooseMethodArray.map((item) => (
          <ChooseMethodCard
            key={item.id}
            item={item}
            onClick={() => navigate(item.link)}
          />
        ))}
      </div>
    </div>
  )
}
