import '../TalentProfile/TalentProfileSidebar.scss'

import React from 'react'
import { Link, Outlet } from 'react-router-dom'

import logo from '../../assets/logo.png'
import { useAuth } from '../../context/contextHook'

const AdminProfileSidebar = () => {
  const auth = useAuth()

  return (
    <div className="dashboard">
      <div className="sidebar-container">
        <a href="/" className="logo-li">
          {/* <img src={logo} alt="" /> */}
          <h4>Support Pro</h4>
        </a>
        <h2>Admin Dashboard</h2>
        <nav>
          <ul>
            <li>
              <Link to={`/adminDashboard/viewcandidates`}>View Candidates</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="dashboard-body">
        {!auth?.isLoggedIn ? (
          <div>
            <h6>You need to be a registered admin</h6>
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

export default AdminProfileSidebar
