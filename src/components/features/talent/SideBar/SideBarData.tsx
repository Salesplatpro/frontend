import React from 'react'
import { BiMessageDetail } from 'react-icons/bi'
import { BsChatDots } from 'react-icons/bs'
import { IoBagOutline } from 'react-icons/io5'
import { MdSpaceDashboard } from 'react-icons/md'
import { MdPersonOutline } from 'react-icons/md'
import { MdOutlineAssessment } from 'react-icons/md'
import { RiFlowChart } from 'react-icons/ri'

const ICON_SIZE = 20

export const sidebarData = [
  {
    name: 'Dashboard',
    icon: <MdSpaceDashboard size={ICON_SIZE} />,
    link: '/talentDashboard/',
  },
  {
    name: 'Profile',
    icon: <MdPersonOutline size={ICON_SIZE} />,
    link: '/talentDashboard/TalentProfile',
  },
  {
    name: 'Pre-Assessment test',
    icon: <MdOutlineAssessment size={ICON_SIZE} />,

    link: '/talentDashboard/talentQuiz',
  },
  {
    name: 'Jobs',
    icon: <IoBagOutline size={ICON_SIZE} />,
    link: '/talentDashboard/job',
    end: false,
  },

  {
    name: 'Inbox',
    icon: <BsChatDots size={ICON_SIZE} />,
    link: '/talentDashboard/chat',
  },

  {
    name: 'Notifications',
    icon: <BiMessageDetail size={ICON_SIZE} />,
    link: '/talentDashboard/notification',
  },
  {
    name: 'Applications pipeline',
    icon: <RiFlowChart size={ICON_SIZE} />,
    link: '/talentDashboard/applicationPipeline',
    end: false,
  },
]
