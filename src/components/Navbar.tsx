import React from 'react'

// @ts-ignore
import logo from '../assets/logo.png'
import { useAuth } from '../context/contextHook'

const Navbar = () => {
  const auth = useAuth()

  const handleLogout = () => {
    auth.logout()
  }

  return (
    <React.Fragment>
      <div className="navi">
        <div className="container wrapper nav-navigate">
          <nav className="navbar">
            <ul>
              <a href="/" className="logo-li">
                <img src={logo} alt="" />
              </a>
              <li>
                <a href="solution">solutions</a>
              </li>
              <li>
                <a href=" ">resources</a>
              </li>
              <li>
                <a href="explore">explore jobs</a>
              </li>
              <li>
                <a href="customerstories">customers stories</a>
              </li>
            </ul>
          </nav>

          <div className="action-btn nav-font">
            {auth?.isLoggedIn ? (
              <button className="login" type="button" onClick={handleLogout}>
                <a href="/">Logout</a>
              </button>
            ) : (
              <button className="login" type="button">
                <a href="login">Login</a>
              </button>
            )}

            <button className="apply">
              <a href="talentDashboard/talentProfile">Apply for jobs</a>
            </button>
            <button className="hire">
              <a href="recruiterDashboard/postjob">Hire Talents</a>
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Navbar
