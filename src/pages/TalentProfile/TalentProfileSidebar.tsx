import './TalentProfileSidebar.scss'

import React, { useEffect, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { IoMdMenu } from 'react-icons/io'
import { MdLock } from 'react-icons/md'
import { Outlet, useBlocker } from 'react-router-dom'

import { sidebarData as originalSidebarData } from '@/components/features/talent/SideBar/SideBarData'
import { SideBar } from '@/components/layout/sidebar/SideBar'
import { useAssessmentLockStore } from '@/features/pre-assessment/lockStore'
import { notify } from '@/utils/toastNotifications'

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

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isLocked && currentLocation.pathname !== nextLocation.pathname,
  )

  useEffect(() => {
    if (blocker.state === 'blocked') {
      notify('info', 'Complete or submit your assessment to continue.', {
        autoClose: 2000,
      })
      blocker.reset()
    }
  }, [blocker])

  useEffect(() => {
    if (!isLocked) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isLocked])

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
          {!isOpen && <IoMdMenu className="text-3xl" />}
        </button>
        <LoggedInUserBadge />
      </div>

      <div className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
        <SideBar
          sideBarData={currentSidebarData}
          handleClick={() => setIsOpen(false)}
        />

        <button className="close" onClick={() => setIsOpen(!isOpen)}>
          {isOpen && <AiOutlineCloseCircle className="text-2xl" />}
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
              <MdLock className="text-white text-2xl" />
            </div>

            <div className="text-center flex flex-col gap-1.5">
              <p
                className="text-white text-sm font-bold font-raleway"
                style={{ letterSpacing: '0.01em' }}>
                Navigation Locked
              </p>
              <p
                className="font-raleway text-xs leading-relaxed"
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
