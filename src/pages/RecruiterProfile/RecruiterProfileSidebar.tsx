import '../TalentProfile/TalentProfileSidebar.scss'

import React, { useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import {
  IoIosArrowDown,
  IoMdMenu,
  IoMdNotificationsOutline,
} from 'react-icons/io'
import { Outlet } from 'react-router-dom'

import employer from '../../assets/employer.png'
import { SideBar } from '../../components'
import { sidebarData } from '../../components/RecruiterProfile/SideBar/sidebarData'

const RecruiterProfileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <div className="dashboard">
      <div className="sidebar-container">
        <SideBar sideBarData={sidebarData} handleClick={handleClose} />
        <button className="close" onClick={() => setIsOpen(!isOpen)}>
          {isOpen && <AiOutlineCloseCircle className="text-[24px]" />}
        </button>
      </div>
      <div className="dashboard-body">
        <div className="dashboard-nav">
          <button className="menu" onClick={() => setIsOpen(!isOpen)}>
            {!isOpen && <IoMdMenu className="text-[30px]" />}
          </button>
          <div>
            <div className="employer">
              <IoMdNotificationsOutline size={24} />
              <div className="employerDetails">
                <div>
                  <div className="employerName">Olivia Rhye</div>
                  <div className="employerType">Project Manager</div>
                </div>
                <img src={employer} alt="employer" />
              </div>
              <IoIosArrowDown size={20} />
            </div>
          </div>
        </div>
        <div className="outlet">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default RecruiterProfileSidebar
