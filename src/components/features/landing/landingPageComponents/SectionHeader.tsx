import cn from 'classnames'
import React, { ReactNode } from 'react'

import { Text } from '@/components/ui/Typography'

type SectionHeaderProps = {
  title?: string | ReactNode
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
    <Text
      size="fs-md"
      color={variant === 'secondary' ? 'white' : 'tag'}
      weight="bold">
      {title}
    </Text>
    <Text
      size="fs-2xl"
      weight="bolder"
      color={variant === 'secondary' ? 'white' : 'default'}>
      {subTitle}
    </Text>
  </div>
)
