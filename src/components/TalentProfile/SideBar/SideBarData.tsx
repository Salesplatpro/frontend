import React from 'react'
import { IoIosChatbubbles } from 'react-icons/io'
import { IoBagOutline } from 'react-icons/io5'
import { LuHome } from 'react-icons/lu'
import { MdPersonOutline } from 'react-icons/md'
import { MdOutlineAssessment } from 'react-icons/md'
import { MdNotificationAdd } from 'react-icons/md'
import { SiAzurepipelines } from 'react-icons/si'

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
    name: 'Jobs',
    icon: <IoBagOutline size={ICON_SIZE} color={COLOR} />,
    link: '/talentDashboard/job',
  },

  {
    name: 'Chat',
    icon: <IoIosChatbubbles size={ICON_SIZE} color={COLOR} />,
    link: '/talentDashboard/chat',
  },

  {
    name: 'Notification',
    icon: <MdNotificationAdd size={ICON_SIZE} color={COLOR} />,
    link: '/talentDashboard/notification',
  },
  {
    name: 'Applications pipeline',
    icon: <SiAzurepipelines size={ICON_SIZE} color={COLOR} />,
    link: '/talentDashboard/applicationPipeline',
  },
]
