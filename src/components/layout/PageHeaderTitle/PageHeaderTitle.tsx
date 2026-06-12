import React from 'react'

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
  const { data, isLoading } = useGetCampaignNameQuery(paramsId)

  return (
    <div className="pt-2">
      <h1 className=" font-raleway text-[#101828] text-[32px] font-bold leading-[37.57px]">
        {title
          ? title
          : isLoading
          ? ''
          : `${data?.data?.name || 'Unknown'} scouting`}{' '}
      </h1>
      <p className="font-raleway font-normal text-[20px] leading-[23.48px] text-[#101828]">
        {description}
      </p>
    </div>
  )
}
