import React, { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

import { CountBadge } from '@/components/ui/Badge'

import styles from './sidebarList.module.scss'

type SidebarListProps = {
  icon: ReactNode
  name: string
  details?: string
  count?: number
  active: boolean
  onClick: () => void
  link?: string
}

export const SidebarList = ({
  icon,
  name,
  details,
  count,
  active,
  onClick,
  link,
}: SidebarListProps) => {
  return (
    <NavLink
      to={link || ''}
      className={`${styles.listContainer} ${active ? styles.active : ''}`}
      onClick={onClick}>
      <div className={styles.listItem}>
        <div>{icon}</div>
        <div>
          <div className="font-raleway font-medium text-[16px] leading-[24px]">
            {name}
          </div>
          <div>{details}</div>
        </div>
      </div>
      <CountBadge item={count} />
    </NavLink>
  )
}
