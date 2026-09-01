import cn from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import {
  HiOutlineCreditCard,
  HiOutlineLockClosed,
  HiOutlineUser,
} from 'react-icons/hi'
import { HiArrowRightOnRectangle } from 'react-icons/hi2'
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoMdNotificationsOutline,
} from 'react-icons/io'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { MdOutlineWorkspacePremium } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

import { Avatar } from '@/components/ui/Avatar'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { changePasswordPathForRole } from '@/features/auth/utils/dashboardPath'
import { getEmailVerificationBadge } from '@/features/email-verification/utils/getEmailVerificationBadge'
import { useNotifications } from '@/features/notifications/hooks/useNotifications'
import { getBillingPlanBadge } from '@/features/pricing/utils/getBillingPlanBadge'
import { useProfile } from '@/features/profile/hooks/useProfile'

import styles from './LoggedInUserBadge.module.scss'

const NOTIFICATION_ROUTE_BY_ROLE: Partial<Record<string, string>> = {
  talent: '/talentDashboard/Notification',
}

const PROFILE_ROUTE_BY_ROLE: Partial<Record<string, string>> = {
  talent: '/talentDashboard/talentProfile',
  recruiter: '/recruiterDashboard/profile',
}

const PLAN_ROUTE_BY_ROLE: Partial<Record<string, string>> = {
  recruiter: '/recruiterDashboard/plan',
}

export const LoggedInUserBadge: React.FC = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const { profile: userInfo, isLoading, error } = useProfile()
  const { unReadCount } = useNotifications()

  const role = user?.userRole
  const notificationRoute = role ? NOTIFICATION_ROUTE_BY_ROLE[role] : undefined
  const profileRoute = role ? PROFILE_ROUTE_BY_ROLE[role] : undefined
  const planRoute = role ? PLAN_ROUTE_BY_ROLE[role] : undefined
  const changePasswordRoute = changePasswordPathForRole(role)

  const firstName = userInfo?.firstName || user?.firstName || ''
  const lastName = userInfo?.lastName || user?.lastName || ''
  const fullName = `${firstName} ${lastName}`.trim() || 'Account'
  const email = userInfo?.email || user?.email || ''
  const isVerified = !!userInfo?.emailVerifiedAt
  const isPaid = userInfo?.billingPlan === 'paid'
  const verificationBadge = getEmailVerificationBadge(userInfo?.emailVerifiedAt)
  const planBadge = getBillingPlanBadge(userInfo?.billingPlan)

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev)
  }

  const closeDropdown = () => setIsDropdownVisible(false)

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

  const goTo = (path: string) => {
    closeDropdown()
    navigate(path)
  }

  return (
    <div className={styles.container} ref={dropdownRef}>
      <div
        className={cn(styles.notificationIcon, {
          [styles.notificationIconClickable]: !!notificationRoute,
        })}
        onClick={
          notificationRoute ? () => navigate(notificationRoute) : undefined
        }
        role={notificationRoute ? 'button' : undefined}
        aria-label="Notifications">
        <IoMdNotificationsOutline size={22} />
        {!!unReadCount && <span className={styles.unreadDot} aria-hidden />}
      </div>

      {isLoading ? (
        <div className={styles.loadingRow}>
          <div className={styles.avatarSkeleton} />
          <div className={styles.textSkeletons}>
            <div className={cn(styles.skeletonLine, styles.short)} />
          </div>
        </div>
      ) : error ? (
        <div className={styles.errorText}>Error loading profile</div>
      ) : (
        <button
          type="button"
          className={styles.trigger}
          onClick={toggleDropdown}
          aria-expanded={isDropdownVisible}
          aria-haspopup="menu">
          <span className={styles.name}>{fullName}</span>
          <span
            className={cn(styles.pill, styles.verifiedPill)}
            style={{
              backgroundColor: verificationBadge.backgroundColor,
              color: verificationBadge.color,
            }}>
            {isVerified ? (
              <IoCheckmarkCircle size={14} />
            ) : (
              <span className={styles.pillDot} />
            )}
            {verificationBadge.status}
          </span>
          {role === 'recruiter' && isPaid && (
            <span
              className={cn(styles.pill, styles.paidPill)}
              style={{
                backgroundColor: planBadge.backgroundColor,
                color: planBadge.color,
              }}>
              <MdOutlineWorkspacePremium size={14} />
              Paid
            </span>
          )}
          <span className={styles.avatarWrap}>
            <Avatar firstName={firstName} lastName={lastName} size="md" />
          </span>
          <IoIosArrowDown
            size={16}
            className={cn(styles.chevron, {
              [styles.chevronOpen]: isDropdownVisible,
            })}
          />
        </button>
      )}

      {isDropdownVisible && !isLoading && !error && (
        <div className={styles.dropdownMenu} role="menu">
          <div className={styles.dropdownHeader}>
            <div className={styles.headerAvatar}>
              <Avatar firstName={firstName} lastName={lastName} size="lg" />
              <span className={styles.onlineDot} aria-hidden />
            </div>
            <p className={styles.headerName}>{fullName}</p>
            <p className={styles.headerEmail}>{email}</p>
            <div className={styles.headerPills}>
              <span
                className={cn(styles.pill, styles.verifiedPill)}
                style={{
                  backgroundColor: verificationBadge.backgroundColor,
                  color: verificationBadge.color,
                }}>
                {isVerified ? (
                  <IoCheckmarkCircle size={14} />
                ) : (
                  <span className={styles.pillDot} />
                )}
                {verificationBadge.status}
              </span>
              {role === 'recruiter' && (
                <span
                  className={cn(styles.pill, styles.paidPill)}
                  style={{
                    backgroundColor: planBadge.backgroundColor,
                    color: planBadge.color,
                  }}>
                  <MdOutlineWorkspacePremium size={14} />
                  {isPaid ? 'Paid Plan' : 'Free plan'}
                </span>
              )}
            </div>
          </div>

          {profileRoute && (
            <button
              type="button"
              className={styles.menuRow}
              onClick={() => goTo(profileRoute)}
              role="menuitem">
              <span className={styles.menuIcon}>
                <HiOutlineUser size={20} />
              </span>
              <span className={styles.menuCopy}>
                <span className={styles.menuTitle}>My Profile</span>
                <span className={styles.menuHint}>
                  View and manage your profile
                </span>
              </span>
              <IoIosArrowForward className={styles.menuChevron} />
            </button>
          )}

          {planRoute && (
            <button
              type="button"
              className={styles.menuRow}
              onClick={() => goTo(planRoute)}
              role="menuitem">
              <span className={styles.menuIcon}>
                <HiOutlineCreditCard size={20} />
              </span>
              <span className={styles.menuCopy}>
                <span className={styles.menuTitle}>Plan & Billing</span>
                <span className={styles.menuHint}>
                  View your plan details and billing history
                </span>
              </span>
              <IoIosArrowForward className={styles.menuChevron} />
            </button>
          )}

          {changePasswordRoute && (
            <button
              type="button"
              className={styles.menuRow}
              onClick={() => goTo(changePasswordRoute)}
              role="menuitem">
              <span className={styles.menuIcon}>
                <HiOutlineLockClosed size={20} />
              </span>
              <span className={styles.menuCopy}>
                <span className={styles.menuTitle}>Change password</span>
                <span className={styles.menuHint}>
                  Update the password for your account
                </span>
              </span>
              <IoIosArrowForward className={styles.menuChevron} />
            </button>
          )}

          <button
            type="button"
            className={cn(styles.menuRow, styles.logoutRow)}
            onClick={() => logout()}
            role="menuitem">
            <span className={cn(styles.menuIcon, styles.logoutIcon)}>
              <HiArrowRightOnRectangle size={20} />
            </span>
            <span className={styles.menuCopy}>
              <span className={cn(styles.menuTitle, styles.logoutTitle)}>
                Logout
              </span>
              <span className={styles.menuHint}>Sign out of your account</span>
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
