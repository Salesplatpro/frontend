import cn from 'classnames'
import React from 'react'

import { BaseText } from './typography'

type SectionHeaderProps = {
  title: string
  subTitle: string
  className: string
}
export const SectionHeader = ({
  title,
  subTitle,
  className,
}: SectionHeaderProps) => (
  <div className={cn('flex flex-col gap-3', className)}>
    <BaseText fontSize="fs-md" fontColor="tag">
      {title}
    </BaseText>
    <BaseText fontSize="fs-3xl" fontWeight="bold">
      {subTitle}
    </BaseText>
  </div>
)
