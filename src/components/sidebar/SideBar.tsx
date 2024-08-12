import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import logo from '../../assets/logo.png'
import { SidebarList } from '../lists'
import styles from './Sidebar.module.scss'
import { feedBack } from './sidebarData'

interface sideBarProps {
  sideBarData: {
    name: string
    icon: React.ReactElement
    count?: number
    link?: string
  }[]
  handleClick: () => void
}

export const SideBar: React.FC<sideBarProps> = ({
  sideBarData,
  handleClick,
}) => {
  const [activeItem, setActiveItem] = useState<string | null>(null)

  const handleItemClick = (type: string, index: number) => {
    setActiveItem(`${type}-${index}`)
    handleClick()
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
          {sideBarData.map((data, index) => (
            <SidebarList
              key={index}
              icon={data.icon}
              name={data.name}
              count={data.count}
              link={data.link}
              active={activeItem === `sideBar-${index}`}
              onClick={() => handleItemClick('sideBar', index)}
            />
          ))}
        </div>
      </div>
      <div className={styles.employer}>
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
    </div>
  )
}
