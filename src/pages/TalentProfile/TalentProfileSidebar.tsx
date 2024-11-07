import './TalentProfileSidebar.scss'

import React, { useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { IoMdMenu } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

import { SideBar } from '../../components'
import { sidebarData } from '../../components/TalentProfile/SideBar/SideBarData'
import { RootState } from '../../redux/store/store'
import { LoggedInUserBadge } from '../LoggedInUserBadge'

const TalentProfileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const user = useSelector((state: RootState) => state.auth.user)

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
          sideBarData={sidebarData}
          handleClick={() => setIsOpen(false)}
        />
        <button className="close" onClick={() => setIsOpen(!isOpen)}>
          {isOpen && <AiOutlineCloseCircle className="text-[24px]" />}
        </button>
      </div>
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  )
}

export default TalentProfileSidebar
