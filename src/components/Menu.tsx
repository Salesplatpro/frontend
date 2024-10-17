import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// @ts-ignore
import logo from '../assets/logo.png'
import { logout } from '../redux/features/authSlice/authSlice'
import { RootState } from '../redux/store/store'

const dispatch = useDispatch()
const user = useSelector((state: RootState) => state.auth)
const handleLogout = () => {
  dispatch(logout())
}

// const [toggleBtn, setToggleBtn] = useState(true)

const Menu = () => {
  return (
    <Fragment>
      <nav className="navbar">
        <ul>
          <a href="/" className="logo-li">
            <img src={logo} alt="" />
          </a>
          <li>
            <a href="solution">solutions</a>
          </li>
          <li>
            <a href="/">resources</a>
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
        {user.isLoggedIn ? (
          <button className="login" type="button" onClick={handleLogout}>
            <a href="/">Logout</a>
          </button>
        ) : (
          <button className="login" type="button">
            <a href="login">Login</a>
          </button>
        )}

        <button className="apply">
          <a href="talentRegister">Apply for jobs</a>
        </button>
        <button className="hire">
          <a href="recruiterDashboard/postjob">Hire Talents</a>
        </button>
      </div>
    </Fragment>
  )
}

export default Menu
