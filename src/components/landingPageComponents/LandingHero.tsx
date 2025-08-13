import cn from 'classnames'
import React from 'react'

import applicationPipeline from '../../assets/application_pipeline.png'
import logo from '../../assets/salesplate_support_pro.png'
import { LandingButton } from './LandingButton'
import { containerPadding } from './landingData'
import styles from './styles/LandingHero.module.scss'
import { BaseText } from './typography'

export const LandingHero = () => (
  <div className={styles.container}>
    <div className={cn(styles.heroLeft, containerPadding)}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            Find Top Talent Faster, Smarter, With AuxHr AI.
          </div>
          <BaseText fontColor="white" fontSize="lg" fontWeight="normal">
            AuxHR is your AI-powered recruitment platform built to streamline
            hiring, match top-tier candidates, and scale your team with
            confidence.
          </BaseText>
        </div>
        <div className={styles.btns}>
          <LandingButton
            title="Try it Free"
            variant="primary"
            onClick={() => {}}
          />
          <LandingButton
            title="Get a Demo"
            variant="secondary"
            onClick={() => {}}
          />
        </div>
      </div>
      <div className={styles.heroFooter}>
        <BaseText fontColor="white" fontSize="md" fontWeight="bold">
          Top HR platform by
        </BaseText>
        <img src={logo} alt="Support pro and Salesplat" />
      </div>
    </div>
    <div className={styles.heroRight}>
      <img
        src={applicationPipeline}
        alt="Application Pipeline"
        className={styles.applicationImage}
      />
    </div>
  </div>
)
