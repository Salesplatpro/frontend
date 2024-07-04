import '../TalentProfile/TalentProfileSidebar.scss'

import React from 'react'
import { Outlet } from 'react-router-dom'

import logo from '../../assets/logo.png'
import { useAuth } from '../../context/contextHook'
import { SideBar } from "../../components";

const RecruiterProfileSidebar = () => {
  const auth = useAuth()

  return (
    <div className="dashboard">
      <div className="sidebar-container">
        <SideBar />
      </div>

      <div className="dashboard-body">
        {!auth?.isLoggedIn ? (
          <div>
            <h6>You need to login</h6>
            <div className="action-btn nav-font">
              <button className="login" type="button">
                <a href="/login">login</a>
              </button>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  )
}

export default RecruiterProfileSidebar
