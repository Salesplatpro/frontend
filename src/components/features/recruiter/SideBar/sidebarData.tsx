import React from 'react'
import { BsChatDots } from 'react-icons/bs'
import { CgProfile } from 'react-icons/cg'
import { CiBoxList, CiSearch } from 'react-icons/ci'
import { FiDownload } from 'react-icons/fi'
import { MdWorkOutline } from 'react-icons/md'
import { RxDashboard } from 'react-icons/rx'

const ICON_SIZE = 20

export const sidebarData = [
  {
    name: 'Dashboard',
    icon: <RxDashboard size={ICON_SIZE} />,
    link: '/recruiterDashboard/dashboard',
  },
  {
    name: 'Post a Job',
    icon: <MdWorkOutline size={ICON_SIZE} />,
    link: '/recruiterDashboard/postjob',
    end: false,
  },
  {
    name: 'My Job Posts',
    icon: <MdWorkOutline size={ICON_SIZE} />,
    link: '/recruiterDashboard/myJobPosts',
  },

  {
    name: 'Scout',
    icon: <FiDownload size={ICON_SIZE} />,
    link: '/recruiterDashboard/scout',
    end: false,
  },
  {
    name: 'Talent Search',
    icon: <CiSearch size={ICON_SIZE} />,
    link: '/recruiterDashboard/talent-search',
    end: false,
  },

  {
    name: 'Chat',
    icon: <BsChatDots size={ICON_SIZE} />,
    link: '/recruiterDashboard/chat',
  },
  {
    name: 'Profile',
    icon: <CgProfile size={ICON_SIZE} />,
    link: '/recruiterDashboard/profile',
  },
  {
    name: 'Shortlist',
    icon: <CiBoxList size={ICON_SIZE} />,
    link: '/recruiterDashboard/shortlist',
  },
]
