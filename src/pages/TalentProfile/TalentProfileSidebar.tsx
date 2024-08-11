import './TalentProfileSidebar.scss'
import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { sidebarData } from '../../components/TalentProfile/SideBar/SideBarData'
// import { SideBar } from '../../components/TalentProfile/SideBar/sideBar'
import { SideBar } from '../../components'
import {
  IoMdMenu,
  IoIosArrowDown,
  IoMdNotificationsOutline,
} from 'react-icons/io'
import employer from '../../assets/employer.png'
import { AiOutlineCloseCircle } from 'react-icons/ai'

const TalentProfileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <div className="dashboard">
      <div className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
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

export default TalentProfileSidebar
