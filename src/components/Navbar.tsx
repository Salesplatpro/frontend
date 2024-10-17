/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useEffect, useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoMdClose } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'

// @ts-ignore
import logo from '../assets/logo.png'
import { logout } from '../redux/features/authSlice/authSlice'
import { RootState } from '../redux/store/store'

const Navbar = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth)
  const handleLogout = () => {
    dispatch(logout())
  }

  const [toggleBtn, setToggleBtn] = useState(false)
  const [activeTab, setActiveTab] = useState('/')
  const location = useLocation() // Hook to get the current path

  // Update activeTab based on the current path
  useEffect(() => {
    setActiveTab(location.pathname)
  }, [location.pathname])

  return (
    <React.Fragment>
      <div className="navi">
        <div className="wrapper nav-navigate">
          <nav className="navbar">
            <ul>
              <Link to="/" className="logo-li">
                <img src={logo} alt=" Support Pro" />
              </Link>

              <li>
                <Link
                  to="/solution"
                  className={activeTab === '/solution' ? 'activeTab' : ''}>
                  solution
                </Link>
              </li>

              <li>
                <Link
                  to="#"
                  className={activeTab === '/resources' ? 'activeTab' : ''}>
                  resources
                </Link>
              </li>
              <li>
                <Link
                  to="/explore"
                  className={activeTab === '/explore' ? 'activeTab' : ''}>
                  explore jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/customerstories"
                  className={
                    activeTab === '/customerstories' ? 'activeTab' : ''
                  }>
                  customers stories
                </Link>
              </li>
            </ul>
          </nav>

          <div className="action-btn nav-font">
            {user.isLoggedIn ? (
              <button className="login" type="button" onClick={handleLogout}>
                <Link to="/"> Logout</Link>
              </button>
            ) : (
              <button className="login" type="button">
                <Link to="/login"> Login</Link>
              </button>
            )}

            <button className="apply">
              <Link to="/talentRegister">Apply for jobs</Link>
            </button>
            <button className="hire">
              <Link to="/recruiterRegister">Hire Talents</Link>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden cursor-pointer">
            {toggleBtn ? (
              <>
                <IoMdClose
                  size={27}
                  color="#fff"
                  onClick={() => setToggleBtn(false)} // Close the menu
                  className="absolute top-8 right-8 z-30 flip-2-ver-right-fwd"
                />
                <div className="bg-[#101828] h-[100vh] absolute inset-0 z-20 scale-up-tr">
                  <ul className="flex flex-col items-center justify-center h-full text-white space-y-8 capitalize">
                    <li className="font-semibold text-lg text-[#4985df] capitalize decoration-0 leading-[18px] font-raleway hover:text-white">
                      <Link
                        to="/"
                        className={activeTab === '/' ? 'activeTab' : ''}
                        onClick={() => {
                          setToggleBtn(false) // Close the menu
                        }}>
                        Home
                      </Link>
                    </li>

                    <li className="font-semibold text-lg text-[#4985df] capitalize decoration-0 leading-[18px] font-raleway hover:text-white">
                      <Link
                        to="/solution"
                        className={activeTab === '/solution' ? 'activeTab' : ''}
                        onClick={() => {
                          setToggleBtn(false) // Close the menu
                        }}>
                        solution
                      </Link>
                    </li>
                    <li className="font-semibold text-lg text-[#4985df] capitalize decoration-0 leading-[18px] font-raleway hover:text-white">
                      <Link
                        to="#"
                        className={
                          activeTab === '/resources' ? 'activeTab' : ''
                        }
                        onClick={() => {
                          setToggleBtn(false) // Close the menu
                        }}>
                        Resources
                      </Link>
                    </li>
                    <li className="font-semibold text-lg text-[#4985df] capitalize decoration-0 leading-[18px] font-raleway hover:text-white">
                      <Link
                        to="/explore"
                        className={activeTab === '/explore' ? 'activeTab' : ''}
                        onClick={() => {
                          setToggleBtn(false) // Close the menu
                        }}>
                        Explore Jobs
                      </Link>
                    </li>
                    <li className="font-semibold text-lg text-[#4985df] capitalize decoration-0 leading-[18px] font-raleway hover:text-white">
                      <Link
                        to="/customerstories"
                        className={
                          activeTab === '/customerstories' ? 'activeTab' : ''
                        }
                        onClick={() => {
                          setToggleBtn(false) // Close the menu
                        }}>
                        Customers Stories
                      </Link>
                    </li>
                    <li>
                      {user.isLoggedIn ? (
                        <button
                          className="font-semibold text-lg text-[#4985df] capitalize decoration-0 leading-[18px] font-raleway hover:text-white"
                          type="button"
                          onClick={() => {
                            handleLogout()
                            setToggleBtn(false)
                          }}>
                          <Link to="/"> Logout</Link>
                        </button>
                      ) : (
                        <button
                          className="font-semibold text-lg text-[#4985df] capitalize decoration-0 leading-[18px] font-raleway hover:text-white"
                          type="button"
                          onClick={() => {
                            setToggleBtn(false)
                          }}>
                          <Link to="/login"> Login</Link>
                        </button>
                      )}
                    </li>
                    <li>
                      <button
                        className="bg-transparent border-2 border-[#4985df] text-[#f1f6fd] font-raleway capitalize leading-[18px]  font-semibold text-lg rounded-md px-[12px] py-[12px] hover:bg-[#4279cb] hover:text-white hover:border-[#f1f6fd]"
                        onClick={() => {
                          setToggleBtn(false)
                        }}>
                        <Link to="/talentRegister">Apply for jobs</Link>
                      </button>
                    </li>
                    <li>
                      <button
                        className="bg-[#4985df] border-2 border-[#4985df] text-white capitalize leading-[18px] font-raleway font-semibold text-lg rounded-md px-[12px] py-[12px] hover:bg-[#4279cb] hover:text-white hover:border-[#4279cb]"
                        onClick={() => {
                          setToggleBtn(false)
                        }}>
                        <Link to="/recruiterRegister">Hire Talents</Link>
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <GiHamburgerMenu
                size={27}
                color="#fff"
                onClick={() => setToggleBtn(true)} // Open the menu
                className="flip-2-ver-right-fwd"
              />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Navbar
