import React, { ReactNode, useState } from "react";
import { CgProfile } from 'react-icons/cg'
import { MdSupport } from 'react-icons/md'
import { Link } from 'react-router-dom'

import logo from '../../assets/logo.png'
import { SidebarList } from '../lists'
import styles from './sidebar.module.scss'

interface sideBarProps {
  sideBarData: {
    name: string
    icon: ReactNode
    count?: number
    link?: string
  }[]
  unreadCount?: number
  handleClick?: () => void
}

const feedBack = [
  {
    name: 'Support',
    icon: <MdSupport size={24} />,
    link: 'support',
  },
  {
    name: 'Leave us feedBack',
    icon: <CgProfile size={24} />,
  },
]

export const SideBar: React.FC<sideBarProps> = ({
  sideBarData,
  handleClick,
}) => {
  const [activeItem, setActiveItem] = useState<string | null>(null)

  const handleItemClick = (type: string, index: number) => {
    setActiveItem(`${type}-${index}`)
    if (handleClick) {
      handleClick()
    }
  }

  return (
    <div className={styles.sideBarContainer}>
      <div>
        <div className={styles.imageContainer}>
          <Link to="/">
            <img src={logo} className={styles.logo} alt="support pro" />
          </Link>
        </div>
        <div className={styles.sidebarList}>
          {sideBarData.map((data, index) => {
            return (
              <SidebarList
                key={index}
                icon={data.icon}
                name={data.name}
                count={data.count}
                link={data.link}
                active={activeItem === `sideBar-${index}`}
                onClick={() => handleItemClick('sideBar', index)}
              />
            )
          })}
        </div>
      </div>
      <div>
        {feedBack.map((data, index) => (
          <SidebarList
            key={index}
            icon={data.icon}
            name={data.name}
            link={data.link}
            active={activeItem === `feedback-${index}`}
            onClick={() => handleItemClick('feedback', index)}
          />
        ))}
      </div>
    </div>
  )
}
