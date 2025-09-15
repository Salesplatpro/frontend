import './TalentProfileSidebar.scss' // Ensure your styles are imported

import React, { useEffect, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { IoMdMenu } from 'react-icons/io'
import { Outlet } from 'react-router-dom'

import { SideBar } from '../../components/sidebar/SideBar'
import { sidebarData as originalSidebarData } from '../../components/TalentProfile/SideBar/SideBarData'
import { LoggedInUserBadge } from '../LoggedInUserBadge'

interface TalentSidebarContext {
  setUnreadCount: (count: number) => void
}

const TalentProfileSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [currentSidebarData, setCurrentSidebarData] =
    useState(originalSidebarData)

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
      </div>

      <div className="outlet">
        <Outlet context={{ setUnreadCount } as TalentSidebarContext} />
      </div>
    </div>
  )
}

export default TalentProfileSidebar
