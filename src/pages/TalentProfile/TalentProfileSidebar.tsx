import React from 'react'
import './TalentProfileSidebar.scss'
import { Link, Outlet } from 'react-router-dom'
import logo from '../../assets/logo.png'
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
              <Link to={`/talentDashboard/talentProfile`}>Profile Details</Link>
            </li>
            <li>
              <Link to={`/talentDashboard/talentQuiz`}>Quiz</Link>
            </li>
            <li>
              <Link to={`/talentDashboard/job`}>Job</Link>
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
