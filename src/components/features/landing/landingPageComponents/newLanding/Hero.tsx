import React from 'react'

import { paths } from '@/paths'

import arrowUpRight from './assets/arrow-up-right.svg'
import circlePlay from './assets/circle-play.svg'
import styles from './Hero.module.scss'
import { HeroPanel } from './HeroPanel'

export const Hero = () => (
  <section className={styles.hero}>
    <div className={styles.heroInner}>
      <div className={styles.copy}>
        <h1 className={styles.headline}>
          Hire better.
          <br className={styles.mobileBreak} /> Move faster.
          <br />
          Build stronger teams.
        </h1>
        <p className={styles.subcopy}>
          AuxHR is an AI-powered recruitment platform that helps you find,
          screen, and match the right candidates so your team can spend less
          time hiring and more time building.
        </p>
        <div className={styles.actions}>
          <a href={`/${paths.register}`} className={styles.ctaSolid}>
            Get Started <img src={arrowUpRight} alt="" aria-hidden />
          </a>
          {/* placeholder destination until a real "how it works" target exists */}
          <a href="#how-it-works" className={styles.ctaOutline}>
            <img src={circlePlay} alt="" aria-hidden /> See how it works
          </a>
        </div>
      </div>
      <HeroPanel />
    </div>
  </section>
)
