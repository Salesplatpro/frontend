import React, { useEffect, useRef, useState } from 'react'
import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoMdNotificationsOutline,
} from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useProfile } from '@/features/profile/hooks/useProfile'

import { getDefaultIcon } from '../../utils/getDefaultIcon'

export const LoggedInUserBadge: React.FC = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const { profile: userInfo, isLoading, error } = useProfile()

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
    logout()
    navigate('/login')
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
            src={
              userInfo?.profileImage?.url ||
              getDefaultIcon({ id: user?.id || '', size: 40 })
            }
            alt="Profile"
            className="w-10 h-10 shrink-0 object-cover rounded-full"
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
          className="absolute right-0 top-full mt-2 w-48 bg-[#4884DF] shadow-lg rounded-md z-10">
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
