import React, { ReactNode } from 'react'
import styles from './sidebarList.module.scss'
import { CountBadge } from '../Badges'
import { NavLink } from 'react-router-dom'

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
          <div>{name}</div>
          <div>{details}</div>
        </div>
      </div>
      <CountBadge item={count} />
    </NavLink>
  )
}
