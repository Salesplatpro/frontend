import React, { ReactNode } from 'react'
import { CgProfile } from 'react-icons/cg'
import { MdSupport } from 'react-icons/md'
import { Link } from 'react-router-dom'

import auxHrLogo from '@/assets/aux_logo.png'

import { SidebarList } from '../lists'
import styles from './sidebar.module.scss'

interface sideBarProps {
  sideBarData: {
    name: string
    icon: ReactNode
    count?: number
    link?: string
    end?: boolean
  }[]
  handleClick?: () => void
  /** Optional content rendered between the logo and the nav list (e.g. a company switcher). */
  topSlot?: ReactNode
}

const feedBack = [
  {
    name: 'Support',
    icon: <MdSupport size={24} color="white" />,
    link: 'support',
  },
  {
    name: 'Leave us feedBack',
    icon: <CgProfile size={24} color="white" />,
  },
]

export const SideBar: React.FC<sideBarProps> = ({
  sideBarData,
  handleClick,
  topSlot,
}) => {
  return (
    <div className={styles.sideBarContainer}>
      <div>
        <div className={styles.imageContainer}>
          <Link to="/">
            <img src={auxHrLogo} alt="Aux HR Logo" />
          </Link>
        </div>

        {topSlot}

        <div className={styles.sidebarList}>
          {sideBarData.map((data, index) => {
            return (
              <SidebarList
                key={index}
                icon={data.icon}
                name={data.name}
                count={data.count}
                link={data.link}
                end={data.end}
                onClick={handleClick}
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
            onClick={handleClick}
          />
        ))}
      </div>
    </div>
  )
}
