import React from "react";
import { RxDashboard } from "react-icons/rx";
import { MdWorkOutline, MdOutlineContactSupport } from "react-icons/md";
import { BiMessageDetail } from "react-icons/bi";
import { BsChatDots } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";

const ICON_SIZE = 24;
const COLOR = '#4985DF';

export const sidebarData = [
  {
    name: 'Dashboard',
    icon: <RxDashboard size={ICON_SIZE} color={COLOR} />
  },
  {
    name: 'My Job Listing',
    icon: <MdWorkOutline size={ICON_SIZE} color={COLOR}  />,
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
    icon: <CgProfile size={ICON_SIZE} color={COLOR} />
  },
  {
    name: 'Support',
    icon: <MdOutlineContactSupport size={ICON_SIZE} color={COLOR} />
  }
];
