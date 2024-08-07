import React from 'react'
import { BiMessageDetail } from 'react-icons/bi'
import { BsChatDots } from 'react-icons/bs'
import { CgProfile } from 'react-icons/cg'
import { MdOutlineContactSupport, MdWorkOutline } from 'react-icons/md'
import { RxDashboard } from 'react-icons/rx'

const ICON_SIZE = 24
const COLOR = '#4985DF'

export const sidebarData = [
  {
    name: 'Dashboard',
    icon: <RxDashboard size={ICON_SIZE} color={COLOR} />,
    link: '/recruiterDashboard/postjob',
  },
  {
    name: 'My Job Listing',
    icon: <MdWorkOutline size={ICON_SIZE} color={COLOR} />,
    link: '/recruiterDashboard/jobProfiles',
  },
  {
    name: 'My Job Posts',
    icon: <MdWorkOutline size={ICON_SIZE} color={COLOR} />,
    link: '/recruiterDashboard/jobPost',
  },
  {
    name: 'Notification',
    icon: <BiMessageDetail size={ICON_SIZE} color={COLOR} />,
    count: 12,
  },
  {
    name: 'Chat',
    icon: <BsChatDots size={ICON_SIZE} color={COLOR} />,
    count: 10,
  },
  {
    name: 'Profile',
    icon: <CgProfile size={ICON_SIZE} color={COLOR} />,
  },
  {
    name: 'Support',
    icon: <MdOutlineContactSupport size={ICON_SIZE} color={COLOR} />,
  },
]
