import React from 'react'
import { IoIosArrowDown, IoMdNotificationsOutline } from 'react-icons/io'
import { useSelector } from 'react-redux'

import employer from '../../assets/employer.png'
import { RootState } from '../../redux/store/store'

export const LoggedInUserBadge = () => {
  const user = useSelector((state: RootState) => state.auth.user)

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
      <IoIosArrowDown size={20} />
    </div>
  )
}
