import React, { useEffect, useRef, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsBuilding } from 'react-icons/bs'
import { HiOutlineUserGroup } from 'react-icons/hi2'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

import { useProfile } from '@/features/profile/hooks/useProfile'

import styles from './CompanyBanner.module.scss'

export const CompanyBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const { profile } = useProfile()
  const activeOrganization = profile?.activeOrganization

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

  const goTo = (path: string) => {
    setIsOpen(false)
    navigate(path)
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}>
        <div className={styles.iconBox}>
          <BsBuilding size={18} />
        </div>
        <div className={styles.info}>
          <span className={styles.name}>
            {activeOrganization?.name ?? 'No company yet'}
          </span>
          <span className={styles.metaRow}>
            {activeOrganization && (
              <span className={styles.activeTag}>Active</span>
            )}
            <span className={styles.planTag}>
              {profile?.billingPlan === 'paid' ? 'Paid' : 'Free plan'}
            </span>
          </span>
        </div>
        {isOpen ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <button
            type="button"
            className={styles.dropdownRow}
            onClick={() => goTo('/recruiterDashboard/company')}>
            <div className={styles.iconBox}>
              <HiOutlineUserGroup size={16} />
            </div>
            <span>Manage companies</span>
          </button>
          <button
            type="button"
            className={styles.dropdownRow}
            onClick={() => goTo('/recruiterDashboard/company/new')}>
            <div className={styles.iconBox}>
              <AiOutlinePlus size={16} />
            </div>
            <span>Create company</span>
          </button>
          <button
            type="button"
            className={styles.dropdownRow}
            onClick={() => goTo('/recruiterDashboard/plan')}>
            <div className={styles.iconBox}>
              <HiOutlineUserGroup size={16} />
            </div>
            <span>View plan</span>
          </button>
        </div>
      )}
    </div>
  )
}
