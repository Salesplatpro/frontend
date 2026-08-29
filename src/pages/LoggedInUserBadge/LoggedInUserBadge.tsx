import cn from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoMdNotificationsOutline,
} from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

import { Avatar } from '@/components/ui/Avatar'
import { CountBadge, StatusBadge } from '@/components/ui/Badge'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { getEmailVerificationBadge } from '@/features/email-verification/utils/getEmailVerificationBadge'
import { useNotifications } from '@/features/notifications/hooks/useNotifications'
import { useProfile } from '@/features/profile/hooks/useProfile'

import styles from './LoggedInUserBadge.module.scss'

const NOTIFICATION_ROUTE_BY_ROLE: Partial<Record<string, string>> = {
  talent: '/talentDashboard/Notification',
}

export const LoggedInUserBadge: React.FC = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const { profile: userInfo, isLoading, error } = useProfile()
  const { unReadCount } = useNotifications()

  const notificationRoute = user?.userRole
    ? NOTIFICATION_ROUTE_BY_ROLE[user.userRole]
    : undefined

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev)
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false)
      }
    }

    if (isDropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownVisible])

  // Handle logout — logout() itself redirects to /login via a full page
  // reload once all caches/stores are cleared.
  const handleLogout = () => {
    logout()
  }

  return (
    <div className={styles.container}>
      <div
        className={cn(styles.notificationIcon, {
          [styles.notificationIconClickable]: !!notificationRoute,
        })}
        onClick={
          notificationRoute ? () => navigate(notificationRoute) : undefined
        }>
        <IoMdNotificationsOutline size={24} />
        {!!unReadCount && (
          <div className={styles.countBadge}>
            <CountBadge item={unReadCount} />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className={styles.loadingRow}>
          <div className={styles.avatarSkeleton} />
          <div className={styles.textSkeletons}>
            <div className={cn(styles.skeletonLine, styles.short)} />
            <div className={cn(styles.skeletonLine, styles.long)} />
          </div>
        </div>
      ) : error ? (
        <div className={styles.errorText}>Error loading profile</div>
      ) : (
        <div className={styles.userRow}>
          <div>
            <div className={styles.userInfoHeader}>
              <span className={styles.name}>{`${userInfo?.firstName || ''} ${
                userInfo?.lastName || ''
              }`}</span>
              <StatusBadge
                {...getEmailVerificationBadge(userInfo?.emailVerifiedAt)}
                showDot
              />
            </div>
            <div className={styles.email}>{userInfo?.email || ''}</div>
          </div>
          <Avatar
            firstName={userInfo?.firstName}
            lastName={userInfo?.lastName}
            size="md"
          />
        </div>
      )}

      {/* Dropdown Toggle */}
      {!isLoading && !error && (
        <div onClick={toggleDropdown} className={styles.dropdownToggle}>
          {isDropdownVisible ? (
            <IoIosArrowUp size={20} />
          ) : (
            <IoIosArrowDown size={20} />
          )}
        </div>
      )}

      {/* Dropdown Menu */}
      {isDropdownVisible && !isLoading && !error && (
        <div ref={dropdownRef} className={styles.dropdownMenu}>
          <div className={styles.dropdownItem} onClick={handleLogout}>
            Logout
          </div>
        </div>
      )}
    </div>
  )
}
