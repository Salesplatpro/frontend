import React from 'react'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'

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
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-grey-700 mb-2">
          <MdOutlineArrowBackIosNew />
          Back
        </button>
      )}
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
