import React, { useState } from 'react'
import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoMdNotificationsOutline,
} from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import employer from '../../assets/employer.png'
import { logout } from '../../redux/features/authSlice/authSlice'
import { RootState } from '../../redux/store/store'

export const LoggedInUserBadge = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <div className="employer">
      <IoMdNotificationsOutline size={24} />
      <div className="employerDetails">
        <div>
          <div className="employerName">
            {user.firstName} {user.lastName}
          </div>
          <div className="employerType">{user.email}</div>
        </div>
        <img src={employer} alt="employer" />
      </div>
      {visible ? (
        <IoIosArrowUp size={20} onClick={() => setVisible(!visible)} />
      ) : (
        <IoIosArrowDown size={20} onClick={() => setVisible(!visible)} />
      )}
      {visible && (
        <div className="absolute right-6 mt-32 w-64 text-center bg-white shadow-lg rounded-md overflow-hidden z-10">
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              dispatch(logout)
              navigate('/')
            }}>
            Logout
          </div>
        </div>
      )}
    </div>
  )
}
