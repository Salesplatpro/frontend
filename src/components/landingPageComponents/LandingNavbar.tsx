import cn from 'classnames'
import React, { useEffect, useState } from 'react'
import { HiOutlineMenu } from 'react-icons/hi'
import { LiaTimesSolid } from 'react-icons/lia'
import { useNavigate } from 'react-router-dom'

import auxHrLogo from '../../assets/aux_logo.png'
import { paths } from '../../paths'
import { LandingButton } from './LandingButton'
import { leftNav, rightNav } from './landingData'
import styles from './styles/LandingNavbar.module.scss'

export const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  // Close mobile nav when screen resizes above 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  return (
    <div className={styles.container}>
      <div className={cn(styles.leftNav, 'pl-5 md:pl-4 lg:pl-20')}>
        <div onClick={() => navigate(paths.home)} className="cursor-pointer">
          <img src={auxHrLogo} alt="Aux HR Logo" />
        </div>

        <div className={styles.leftNavItems}>
          {leftNav.map((item) => (
            <a key={item.name} href={item.url} className={styles.navItem}>
              {item.name}
            </a>
          ))}
        </div>
      </div>

      <div className={cn(styles.rightNav, 'pr-5 md:pr-4 lg:pr-20')}>
        {rightNav.map((item) => (
          <LandingButton
            key={item.name}
            title={item.name}
            variant={item.variant}
            onClick={() => navigate(item.url)}
          />
        ))}
        <div className={styles.menu}>
          {isOpen ? (
            <LiaTimesSolid size={24} onClick={() => setIsOpen(false)} />
          ) : (
            <HiOutlineMenu size={24} onClick={() => setIsOpen(true)} />
          )}
        </div>
      </div>

      {/* Mobile nav overlay */}
      {isOpen && (
        <div className={styles.mobileNav}>
          <div className={styles.mobileNavContent}>
            {leftNav.map((item) => (
              <a
                key={item.name}
                href={item.url}
                className={styles.mobileNavItem}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}

            <div className={styles.mobileNavButtons}>
              {rightNav.map((item) => (
                <LandingButton
                  key={item.name}
                  title={item.name}
                  variant={item.variant}
                  onClick={() => {
                    navigate(item.url)
                    setIsOpen(false)
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
