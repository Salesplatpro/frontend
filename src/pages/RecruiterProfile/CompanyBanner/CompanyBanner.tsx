import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { Link, useNavigate } from 'react-router-dom'

import { StatusBadge } from '@/components/ui/Badge'
import { useMyOrganizations } from '@/features/organizations/hooks/useMyOrganizations'
import { useSwitchOrganization } from '@/features/organizations/hooks/useSwitchOrganization'
import { getOrganizationStatusBadge } from '@/features/organizations/utils/getOrganizationStatusBadge'
import { useProfile } from '@/features/profile/hooks/useProfile'

import styles from './CompanyBanner.module.scss'

export const CompanyBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const navigate = useNavigate()
  const { profile } = useProfile()
  const { organizations } = useMyOrganizations()
  const { switchOrganization, isSwitching } = useSwitchOrganization()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  if (organizations.length === 0) {
    return (
      <div className={styles.wrapper}>
        <Link to="/recruiterDashboard/company" className={styles.trigger}>
          <span className={styles.name}>Create a company</span>
        </Link>
      </div>
    )
  }

  const activeOrganization = profile?.activeOrganization

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}>
        <span className={styles.name}>
          {activeOrganization?.name ?? 'Select a company'}
        </span>
        {isOpen ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {organizations.map((org) => {
            const isActive = org.id === activeOrganization?.id
            return (
              <button
                key={org.id}
                type="button"
                className={styles.orgRow}
                disabled={isActive || isSwitching}
                onClick={async () => {
                  const success = await switchOrganization(org.id)
                  if (success) {
                    setIsOpen(false)
                  }
                }}>
                <span>{org.name}</span>
                {isActive ? (
                  <span>Active</span>
                ) : (
                  <StatusBadge
                    status={org.status}
                    {...getOrganizationStatusBadge(org.status)}
                  />
                )}
              </button>
            )
          })}
          <button
            type="button"
            className={styles.manageLink}
            onClick={() => {
              setIsOpen(false)
              navigate('/recruiterDashboard/company')
            }}>
            Manage companies
          </button>
        </div>
      )}
    </div>
  )
}
