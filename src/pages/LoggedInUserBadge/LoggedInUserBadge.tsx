import React, { useEffect, useRef, useState } from 'react'
import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoMdNotificationsOutline,
} from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useFetchProfileQuery } from '../../redux/api/talent'
import { logout } from '../../redux/features/authSlice/authSlice'
import { RootState } from '../../redux/store/store'
import { getDefaultIcon } from '../../utils/getDefaultIcon'

export const LoggedInUserBadge: React.FC = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((state: RootState) => state.auth.user)
  const { data: userProfile, isLoading, error } = useFetchProfileQuery({})
  const userInfo = userProfile?.data?.user

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev)
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false)
      }
    }

    if (isDropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownVisible])

  // Handle logout
  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div className="relative flex items-center space-x-4">
      <IoMdNotificationsOutline size={24} className="cursor-pointer" />

      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="space-y-1">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-sm">Error loading profile</div>
      ) : (
        <div className="flex items-center space-x-2">
          <div>
            <div className="font-semibold">{`${userInfo?.firstName || ''} ${
              userInfo?.lastName || ''
            }`}</div>
            <div className="text-sm text-gray-500">{userInfo?.email || ''}</div>
          </div>
          <img
            src={userInfo?.picture || getDefaultIcon({ id: user.id, size: 40 })}
            alt="Profile"
            className="w-10 h-10 object-cover rounded-full"
          />
        </div>
      )}

      {/* Dropdown Toggle */}
      {!isLoading && !error && (
        <div onClick={toggleDropdown} className="cursor-pointer">
          {isDropdownVisible ? (
            <IoIosArrowUp size={20} />
          ) : (
            <IoIosArrowDown size={20} />
          )}
        </div>
      )}

      {/* Dropdown Menu */}
      {isDropdownVisible && !isLoading && !error && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-36 w-48 bg-[#4884DF] shadow-lg rounded-md z-10">
          <div
            className="px-4 py-2  cursor-pointer text-white font-raleway font-medium"
            onClick={handleLogout}>
            Logout
          </div>
        </div>
      )}
    </div>
  )
}
