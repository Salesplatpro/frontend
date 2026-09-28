import React from 'react'
import { BiMessageDetail } from 'react-icons/bi'
import { BsChatDots } from 'react-icons/bs'
import { IoBagOutline } from 'react-icons/io5'
import { MdSpaceDashboard } from 'react-icons/md'
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
    name: 'Pre-Assessment test',
    tourId: 'nav-pre-assessment',
    icon: <MdOutlineAssessment size={ICON_SIZE} />,

    link: '/talentDashboard/talentQuiz',
  },
  {
    name: 'Jobs',
    tourId: 'nav-jobs',
    icon: <IoBagOutline size={ICON_SIZE} />,
    link: '/talentDashboard/job',
    end: false,
  },

  {
    name: 'Inbox',
    tourId: 'nav-inbox',
    icon: <BsChatDots size={ICON_SIZE} />,
    link: '/talentDashboard/chat',
  },

  {
    name: 'Notifications',
    tourId: 'nav-notifications',
    icon: <BiMessageDetail size={ICON_SIZE} />,
    link: '/talentDashboard/notification',
  },
  {
    name: 'Applications pipeline',
    tourId: 'nav-pipeline',
    icon: <RiFlowChart size={ICON_SIZE} />,
    link: '/talentDashboard/applicationPipeline',
    end: false,
  },
]
