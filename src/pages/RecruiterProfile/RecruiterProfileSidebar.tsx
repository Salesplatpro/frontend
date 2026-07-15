import '../TalentProfile/TalentProfileSidebar.scss'

import React, { useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { IoMdMenu } from 'react-icons/io'
import { Outlet } from 'react-router-dom'

import { sidebarData } from '@/components/features/recruiter/SideBar/sidebarData'

import { SideBar } from '../../components'
import { LoggedInUserBadge } from '../LoggedInUserBadge'

const RecruiterProfileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

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
          sideBarData={sidebarData}
          handleClick={() => setIsOpen(false)}
        />
        <button className="close" onClick={() => setIsOpen(!isOpen)}>
          {isOpen && <AiOutlineCloseCircle className="text-2xl" />}
        </button>
      </div>
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  )
}

export default RecruiterProfileSidebar
