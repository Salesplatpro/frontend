import React from 'react'

type PageHeaderTitleProps = {
  title: string
  description: string
}

export const PageHeaderTitle = ({
  title,
  description,
}: PageHeaderTitleProps) => {
  return (
    <div className="space-y-2">
      <h1 className=" font-raleway text-[#101828] text-[32px] font-bold leading-[37.57px]">
        {title}
      </h1>
      <p className="font-raleway font-normal text-[20px] leading-[23.48px] text-[#101828]">
        {description}
      </p>
    </div>
  )
}
