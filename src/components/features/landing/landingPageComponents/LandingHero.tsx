import cn from 'classnames'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import applicationPipeline from '@/assets/application_pipeline.png'
import logo from '@/assets/salesplate_support_pro.png'
import { Text } from '@/components/ui/Typography'
import { paths } from '@/paths'

import { LandingButton } from './LandingButton'
import { containerPadding } from './landingData'
import styles from './styles/LandingHero.module.scss'

export const LandingHero = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <div className={cn(styles.heroLeft, containerPadding)}>
        <div className="flex flex-col justify-center gap-12">
          <div className={`${styles.heroContent}`}>
            <Text
              color="white"
              size="fs-4xl"
              className="lg:mt-52 font-raleway mt-14"
              weight="bolder">
              Find Top Talent Faster, Smarter, With AuxHr AI.
            </Text>
            <Text color="white" size="fs-xl" weight="normal">
              AuxHR is your AI-powered recruitment platform built to streamline
              hiring, match top-tier candidates, and scale your team with
              confidence.
            </Text>
          </div>
          <div className={styles.btns}>
            <LandingButton
              title="Try it Free"
              variant="primary"
              onClick={() => {
                navigate(paths.talentRegister)
                console.log('try it free')
              }}
            />
            <LandingButton
              title="Get a Demo"
              variant="secondary"
              onClick={() => {}}
            />
          </div>
        </div>
        <div className={styles.heroFooter}>
          <Text color="white" size="fs-md" weight="bold">
            Top HR platform by
          </Text>
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
}
