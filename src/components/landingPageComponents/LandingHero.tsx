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
      <div className="flex flex-col justify-center gap-12">
        <div className={styles.heroContent}>
          <BaseText
            fontColor="white"
            fontSize="fs-4xl"
            className="mt-52"
            fontWeight="bolder">
            Find Top Talent Faster, Smarter, With AuxHr AI.
          </BaseText>
          <BaseText fontColor="white" fontSize="fs-lg" fontWeight="normal">
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
        <BaseText fontColor="white" fontSize="fs-md" fontWeight="bold">
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
