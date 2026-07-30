import React from 'react'

import { Heading, Text } from '@/components/ui/Typography'
import { useGetCampaignNameQuery } from '@/redux/api/recruiter'

type PageHeaderTitleProps = {
  title?: string
  paramsId?: any
  description: string
}

export const PageHeaderTitle = ({
  paramsId,
  description,
  title,
}: PageHeaderTitleProps) => {
  const { data, isLoading } = useGetCampaignNameQuery(paramsId, {
    skip: !paramsId?.id,
  })

  return (
    <div className="pt-2">
      <Heading level={1}>
        {title
          ? title
          : isLoading
          ? ''
          : `${data?.data?.name || 'Unknown'} scouting`}{' '}
      </Heading>
      <Text as="p" size="fs-xl" color="secondary">
        {description}
      </Text>
    </div>
  )
}
