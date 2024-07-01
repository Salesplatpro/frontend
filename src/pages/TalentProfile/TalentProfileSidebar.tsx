import './TalentProfileSidebar.scss'

import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import { useAuth } from '../../context/contextHook'

const TalentProfileSidebar = () => {
  const auth = useAuth()

  return (
    <div className="dashboard">
      <div className="sidebar-container">
        <a href="/" className="logo-li">
          {/* <img src={logo} alt="" /> */}
          <h4>Salesplat</h4>
        </a>
        <h3>Talent Dashboard</h3>
        <nav>
          <ul>
            <li>
              <NavLink
                to="/talentDashboard/talentProfile"
                className={({ isActive }) => (isActive ? 'active' : '')}>
                Profile Details
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/talentDashboard/talentQuiz"
                className={({ isActive }) => (isActive ? 'active' : '')}>
                Quiz
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/talentDashboard/job"
                className={({ isActive }) => (isActive ? 'active' : '')}>
                Job
              </NavLink>
            </li>
          </ul>
        </nav>
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

export default TalentProfileSidebar
