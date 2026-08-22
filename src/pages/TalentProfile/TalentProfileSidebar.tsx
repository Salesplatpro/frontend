import './TalentProfileSidebar.scss'

import React, { useEffect, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { IoMdMenu } from 'react-icons/io'
import { Outlet } from 'react-router-dom'

import { sidebarData as originalSidebarData } from '@/components/features/talent/SideBar/SideBarData'
import { SideBar } from '@/components/layout/sidebar/SideBar'
import { NavigationLockOverlay } from '@/features/pre-assessment/components/NavigationLockOverlay'
import { useAssessmentNavigationBlocker } from '@/features/pre-assessment/useAssessmentNavigationBlocker'

import { LoggedInUserBadge } from '../LoggedInUserBadge'

interface TalentSidebarContext {
  setUnreadCount: (count: number) => void
}

const TalentProfileSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [currentSidebarData, setCurrentSidebarData] =
    useState(originalSidebarData)

  const { isLocked } = useAssessmentNavigationBlocker()

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

        {isLocked && <NavigationLockOverlay />}
      </div>

      <div className="outlet">
        <Outlet context={{ setUnreadCount } as TalentSidebarContext} />
      </div>
    </div>
  )
}

export default TalentProfileSidebar
