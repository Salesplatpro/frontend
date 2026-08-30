import cn from 'classnames'
import React, { ReactNode } from 'react'
import { HiOutlineInbox } from 'react-icons/hi'

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
    <div className={styles.iconWrap}>
      <div className={styles.icon}>{icon ?? <HiOutlineInbox size={28} />}</div>
    </div>
    <h3 className={styles.title}>{title}</h3>
    {description && <p className={styles.description}>{description}</p>}
    {action && <div className={styles.action}>{action}</div>}
  </div>
)
