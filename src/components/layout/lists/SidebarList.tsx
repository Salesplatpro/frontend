import React, { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

import { CountBadge } from '@/components/ui/Badge'

import styles from './sidebarList.module.scss'

type SidebarListProps = {
  icon: ReactNode
  name: string
  details?: string
  count?: number
  onClick?: () => void
  link?: string
  /** Exact-match the route instead of matching nested child routes too.
   * Defaults to true; set to false for nav items that own nested routes
   * (e.g. a list page with a `/:id` detail route) so the item stays
   * highlighted while the user is on one of those child routes. */
  end?: boolean
}

export const SidebarList = ({
  icon,
  name,
  details,
  count,
  onClick,
  link,
  end = true,
}: SidebarListProps) => {
  const content = (
    <>
      <div className={styles.listItem}>
        <div className={styles.iconBox}>{icon}</div>
        <div>
          <div className="font-raleway font-medium text-base leading-[24px]">
            {name}
          </div>
          <div>{details}</div>
        </div>
      </div>
      <CountBadge item={count} />
    </>
  )

  // Entries with no destination (e.g. "Profile") can't be route-matched —
  // render as a plain, never-active row instead of an empty-`to` NavLink,
  // which would otherwise match every route and always show as active.
  if (!link) {
    return (
      <div className={styles.listContainer} onClick={onClick}>
        {content}
      </div>
    )
  }

  return (
    <NavLink
      to={link}
      end={end}
      className={({ isActive }) =>
        `${styles.listContainer} ${isActive ? styles.active : ''}`
      }
      onClick={onClick}>
      {content}
    </NavLink>
  )
}
