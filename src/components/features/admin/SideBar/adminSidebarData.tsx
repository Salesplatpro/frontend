import React from 'react'
import {
  HiOutlineBriefcase,
  HiOutlineChatAlt2,
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup,
} from 'react-icons/hi'
import { HiOutlineUserCircle, HiOutlineUsers } from 'react-icons/hi2'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'

const ICON_SIZE = 20

export const adminSidebarData = [
  {
    name: 'Talents',
    icon: <HiOutlineUsers size={ICON_SIZE} />,
    link: '/adminDashboard/talents',
  },
  {
    name: 'Recruiters',
    icon: <HiOutlineUserCircle size={ICON_SIZE} />,
    link: '/adminDashboard/recruiters',
  },
  {
    name: 'Organizations',
    icon: <HiOutlineOfficeBuilding size={ICON_SIZE} />,
    link: '/adminDashboard/organizations',
    end: false,
  },
  {
    name: 'Jobs',
    icon: <HiOutlineBriefcase size={ICON_SIZE} />,
    link: '/adminDashboard/jobs',
  },
  {
    name: 'View Candidates',
    icon: <HiOutlineUserGroup size={ICON_SIZE} />,
    link: '/adminDashboard/viewcandidates',
  },
  {
    name: 'Roles',
    icon: <MdOutlineAdminPanelSettings size={ICON_SIZE} />,
    link: '/adminDashboard/roles',
  },
  {
    name: 'Feedback',
    icon: <HiOutlineChatAlt2 size={ICON_SIZE} />,
    link: '/adminDashboard/feedback',
  },
]
