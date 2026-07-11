import './TalentProfileSidebar.scss'

import React, { useEffect, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { IoMdMenu } from 'react-icons/io'
import { MdLock } from 'react-icons/md'
import { Outlet } from 'react-router-dom'

import { sidebarData as originalSidebarData } from '@/components/features/talent/SideBar/SideBarData'
import { SideBar } from '@/components/layout/sidebar/SideBar'
import { useAssessmentLockStore } from '@/features/pre-assessment/lockStore'

import { LoggedInUserBadge } from '../LoggedInUserBadge'

interface TalentSidebarContext {
  setUnreadCount: (count: number) => void
}

const TalentProfileSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [currentSidebarData, setCurrentSidebarData] =
    useState(originalSidebarData)

  const isLocked = useAssessmentLockStore((s) => s.isLocked)

  useEffect(() => {
    const updatedData = originalSidebarData.map((item) => {
      if (item.name === 'Notification') {
        return { ...item, count: unreadCount }
      }
      return item
    })
    setCurrentSidebarData(updatedData)
  }, [unreadCount])

  return (
    <div className="dashboard">
      <div className="dashboard-nav">
        <button className="menu" onClick={() => setIsOpen(!isOpen)}>
          {!isOpen && <IoMdMenu className="text-[30px]" />}
        </button>
        <LoggedInUserBadge />
      </div>

      <div className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
        <SideBar
          sideBarData={currentSidebarData}
          handleClick={() => setIsOpen(false)}
        />

        <button className="close" onClick={() => setIsOpen(!isOpen)}>
          {isOpen && <AiOutlineCloseCircle className="text-[24px]" />}
        </button>

        {isLocked && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6"
            style={{ backgroundColor: 'rgba(10,18,38,0.82)', zIndex: 20 }}>
            <div
              className="flex items-center justify-center w-14 h-14 rounded-full"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1.5px solid rgba(255,255,255,0.18)',
              }}>
              <MdLock className="text-white text-[26px]" />
            </div>

            <div className="text-center flex flex-col gap-1.5">
              <p
                className="text-white text-[13px] font-bold font-raleway"
                style={{ letterSpacing: '0.01em' }}>
                Navigation Locked
              </p>
              <p
                className="font-raleway text-[11px] leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.55)' }}>
                You are currently taking an assessment.
                <br />
                Complete or submit to continue.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="outlet">
        <Outlet context={{ setUnreadCount } as TalentSidebarContext} />
      </div>
    </div>
  )
}

export default TalentProfileSidebar
