import React from 'react'
import { HiOutlineUserGroup } from 'react-icons/hi'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'

const ICON_SIZE = 24
const COLOR = '#ffffff'

export const adminSidebarData = [
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
