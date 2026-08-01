import React from 'react'

import { BackButton } from '@/components/ui/BackButton'
import { Heading, Text } from '@/components/ui/Typography'
import { useGetCampaignNameQuery } from '@/redux/api/recruiter'

type PageHeaderTitleProps = {
  title?: string
  paramsId?: any
  description: string
  onBack?: () => void
}

export const PageHeaderTitle = ({
  paramsId,
  description,
  title,
  onBack,
}: PageHeaderTitleProps) => {
  const { data, isLoading } = useGetCampaignNameQuery(paramsId, {
    skip: !paramsId?.id,
  })

  return (
    <div className="pt-2">
      {onBack && <BackButton onClick={onBack} />}
      <Heading level={1}>
        {title
          ? title
          : isLoading
          ? ''
          : `${data?.data?.scoutJob?.name || 'Unknown'} scouting`}{' '}
      </Heading>
      <Text as="p" size="fs-xl" color="secondary">
        {description}
      </Text>
    </div>
  )
}
