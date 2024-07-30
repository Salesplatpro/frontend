import React from 'react'
import { IoBagOutline } from 'react-icons/io5'
import { LuHome } from 'react-icons/lu'
import { MdPersonOutline } from 'react-icons/md'
import { MdOutlineAssessment } from 'react-icons/md'

const ICON_SIZE = 24
const COLOR = '#ffffff'

export const sidebarData = [
  {
    name: 'Dashboard',
    icon: <LuHome size={ICON_SIZE} color={COLOR} />,
    link: '/talentDashboard/',
  },
  {
    name: 'Profile',
    icon: <MdPersonOutline size={ICON_SIZE} color={COLOR} />,
    link: '/talentDashboard/TalentProfile',
  },
  {
    name: 'Pre-Assessment test',
    icon: <MdOutlineAssessment size={ICON_SIZE} color={COLOR} />,
    // count: 12,
    link: '/talentDashboard/TalentQuiz',
  },
  {
    name: 'Job post',
    icon: <IoBagOutline size={ICON_SIZE} color={COLOR} />,
    link: '/talentDashboard/job',
  },
  {
    name: 'Applications pipeline',
    icon: <IoBagOutline size={ICON_SIZE} color={COLOR} />,
    link: '/talentDashboard/applicationPipeline',
  },
]
