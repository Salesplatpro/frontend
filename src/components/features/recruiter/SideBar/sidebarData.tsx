import React from 'react'
import { BiMessageDetail } from 'react-icons/bi'
import { BsChatDots } from 'react-icons/bs'
import { CgProfile } from 'react-icons/cg'
import { CiBoxList } from 'react-icons/ci'
import { FiDownload } from 'react-icons/fi'
import { MdWorkOutline } from 'react-icons/md'
import { RxDashboard } from 'react-icons/rx'

const ICON_SIZE = 24
const COLOR = '#ffffff'

export const sidebarData = [
  {
    name: 'Dashboard',
    icon: <RxDashboard size={ICON_SIZE} color={COLOR} />,
    link: '/recruiterDashboard/dashboard',
  },
  {
    name: 'Post a Job',
    icon: <MdWorkOutline size={ICON_SIZE} color={COLOR} />,
    link: '/recruiterDashboard/postjob',
  },
  {
    name: 'My Job Posts',
    icon: <MdWorkOutline size={ICON_SIZE} color={COLOR} />,
    link: '/recruiterDashboard/myJobPosts',
  },

  {
    name: 'Scout',
    icon: <FiDownload size={ICON_SIZE} color={COLOR} />,
    link: '/recruiterDashboard/scout',
  },

  {
    name: 'Notification',
    icon: <BiMessageDetail size={ICON_SIZE} color={COLOR} />,
    count: '',
  },
  {
    name: 'Chat',
    icon: <BsChatDots size={ICON_SIZE} color={COLOR} />,
    count: '',
  },
  {
    name: 'Profile',
    icon: <CgProfile size={ICON_SIZE} color={COLOR} />,
  },
  {
    name: 'Shortlist',
    icon: <CiBoxList size={ICON_SIZE} color={COLOR} />,
    link: '/recruiterDashboard/shortlist',
  },
]
