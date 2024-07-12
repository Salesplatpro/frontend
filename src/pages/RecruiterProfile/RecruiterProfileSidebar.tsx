import '../TalentProfile/TalentProfileSidebar.scss'

import React from 'react'
import { Outlet } from 'react-router-dom'

import logo from '../../assets/logo.png'
import { SideBar } from '../../components'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store/store'

const RecruiterProfileSidebar = () => {
  return (
    <div className="dashboard">
      <div className="sidebar-container">
        <SideBar />
      </div>

      <div className="dashboard-body">
        <Outlet />
      </div>
    </div>
  )
}

export default RecruiterProfileSidebar
