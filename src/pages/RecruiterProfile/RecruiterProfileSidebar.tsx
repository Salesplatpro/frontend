import React from 'react'
import '../TalentProfile/TalentProfileSidebar.scss'
import { NavLink, Outlet } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { useAuth } from '../../context/contextHook'

const RecruiterProfileSidebar = () => {
  const auth = useAuth()

  return (
    <div className="dashboard">
      <div className="sidebar-container">
        <a href="/" className="logo-li">
          {/* <img src={logo} alt="Logo" /> */}
          <h4>Support Pro</h4>
        </a>
        <h2>Recruiter Dashboard</h2>
        <nav>
          <ul>
            <li>
              <NavLink
                to="/recruiterDashboard/postjob"
                activeClassName="active">
                Post a Job
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/recruiterDashboard/viewcandidates"
                activeClassName="active">
                View Candidates
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/recruiterDashboard/getTalents"
                activeClassName="active">
                Search For Talents
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/recruiterDashboard/jobProfiles"
                activeClassName="active">
                View Job Profiles
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

export default RecruiterProfileSidebar
