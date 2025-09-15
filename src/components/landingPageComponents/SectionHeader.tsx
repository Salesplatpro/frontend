import cn from 'classnames'
import React, { ReactNode } from 'react'

import { BaseText } from './typography'

type SectionHeaderProps = {
  title: string | ReactNode
  subTitle: string | ReactNode
  className?: string
  variant?: 'primary' | 'secondary'
}
export const SectionHeader = ({
  title,
  subTitle,
  className,
  variant = 'primary',
}: SectionHeaderProps) => (
  <div className={cn('flex flex-col', className)}>
    <BaseText
      fontSize="fs-md"
      fontColor={variant === 'secondary' ? 'white' : 'tag'}
      fontWeight="bold">
      {title}
    </BaseText>
    <BaseText
      fontSize="fs-2xl"
      fontWeight="bolder"
      fontColor={variant === 'secondary' ? 'white' : 'default'}>
      {subTitle}
    </BaseText>
  </div>
)
