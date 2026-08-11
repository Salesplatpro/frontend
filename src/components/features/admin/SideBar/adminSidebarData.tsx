import React from 'react'
import {
  HiOutlineBriefcase,
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup,
} from 'react-icons/hi'
import { HiOutlineUserCircle, HiOutlineUsers } from 'react-icons/hi2'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'

const ICON_SIZE = 24
const COLOR = '#ffffff'

export const adminSidebarData = [
  {
    name: 'Talents',
    icon: <HiOutlineUsers size={ICON_SIZE} color={COLOR} />,
    link: '/adminDashboard/talents',
  },
  {
    name: 'Recruiters',
    icon: <HiOutlineUserCircle size={ICON_SIZE} color={COLOR} />,
    link: '/adminDashboard/recruiters',
  },
  {
    name: 'Organizations',
    icon: <HiOutlineOfficeBuilding size={ICON_SIZE} color={COLOR} />,
    link: '/adminDashboard/organizations',
  },
  {
    name: 'Jobs',
    icon: <HiOutlineBriefcase size={ICON_SIZE} color={COLOR} />,
    link: '/adminDashboard/jobs',
  },
  {
    name: 'View Candidates',
    icon: <HiOutlineUserGroup size={ICON_SIZE} color={COLOR} />,
    link: '/adminDashboard/viewcandidates',
  },
  {
    name: 'Roles',
    icon: <MdOutlineAdminPanelSettings size={ICON_SIZE} color={COLOR} />,
    link: '/adminDashboard/roles',
  },
]
