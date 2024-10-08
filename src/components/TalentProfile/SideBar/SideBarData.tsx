import React from 'react'
import { BsChatDots } from 'react-icons/bs'
import { IoBagOutline } from 'react-icons/io5'
import { LuHome } from 'react-icons/lu'
import { MdPersonOutline } from 'react-icons/md'
import { MdOutlineAssessment } from 'react-icons/md'
import { BiMessageDetail } from 'react-icons/bi'
import { RiFlowChart } from "react-icons/ri";

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
    icon: <BsChatDots size={ICON_SIZE} color={COLOR} />,
    link: '/talentDashboard/chat',
  },

  {
    name: 'Notification',
    icon: <BiMessageDetail size={ICON_SIZE} color={COLOR} />,
    link: '/talentDashboard/notification',
  },
  {
    name: 'Applications pipeline',
    icon: <RiFlowChart size={ICON_SIZE} color={COLOR} />,
    link: '/talentDashboard/applicationPipeline',
  },
]
