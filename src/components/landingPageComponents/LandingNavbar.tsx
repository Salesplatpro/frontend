import React from 'react'

import auxHrLogo from '../../assets/aux_logo.png'
import { LandingButton } from './LandingButton'
import { leftNav, rightNav } from './landingData'
import styles from './styles/LandingNavbar.module.scss'

export const LandingNavbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftNav}>
        <img src={auxHrLogo} alt="Aux HR Logo" />
        <div className={styles.leftNavItems}>
          {leftNav.map((item) => (
            <a key={item.name} href={item.url} className={styles.navItem}>
              {item.name}
            </a>
          ))}
        </div>
      </div>
      <div className={styles.rightNav}>
        {rightNav.map((item) => (
          <LandingButton
            key={item.name}
            title={item.name}
            variant={item.variant}
            onClick={() => {}}
          />
        ))}
      </div>
    </div>
  )
}
