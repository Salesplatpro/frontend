import React from 'react'

import { PageHero } from '@/components/layout/PageHero'
import { BackButton } from '@/components/ui/BackButton'
import { Heading, Text } from '@/components/ui/Typography'
import { useGetCampaignNameQuery } from '@/redux/api/recruiter'

type PageHeaderTitleProps = {
  title?: string
  paramsId?: any
  description: string
  onBack?: () => void
  variant?: 'plain' | 'hero'
}

export const PageHeaderTitle = ({
  paramsId,
  description,
  title,
  onBack,
  variant = 'plain',
}: PageHeaderTitleProps) => {
  const { data, isLoading } = useGetCampaignNameQuery(paramsId, {
    skip: !paramsId?.id,
  })

  const resolvedTitle = title
    ? title
    : isLoading
    ? ''
    : `${data?.data?.scoutJob?.name || 'Unknown'} scouting`

  if (variant === 'hero') {
    return (
      <>
        {onBack && <BackButton onClick={onBack} />}
        <PageHero compact title={resolvedTitle} lead={description} />
      </>
    )
  }

  return (
    <div className="pt-2">
      {onBack && <BackButton onClick={onBack} />}
      <Heading level={1}>{resolvedTitle} </Heading>
      <Text as="p" size="fs-xl" color="secondary">
        {description}
      </Text>
    </div>
  )
}
