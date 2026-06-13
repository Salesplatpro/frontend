import cn from 'classnames'
import React, { ReactNode } from 'react'

import { Heading, Text } from '@/components/ui/Typography'

import styles from './EmptyState.module.scss'

type EmptyStateProps = {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export const EmptyState = ({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) => (
  <div className={cn(styles.container, className)}>
    {icon && <div className={styles.icon}>{icon}</div>}
    <Heading level={3}>{title}</Heading>
    {description && (
      <Text size="fs-sm" color="primary" className={styles.description}>
        {description}
      </Text>
    )}
    {action && <div>{action}</div>}
  </div>
)
