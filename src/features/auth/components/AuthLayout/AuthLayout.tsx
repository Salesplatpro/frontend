import React, { ReactNode } from 'react'

import logo from '@/assets/logo.png'
import { Card } from '@/components/ui/Card'
import { Heading, Text } from '@/components/ui/Typography'

import { Carousel } from '../Carousel'
import styles from './AuthLayout.module.scss'

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
}

export const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => (
  <div className={styles.container}>
    <div className={styles.formColumn}>
      <div className={styles.header}>
        <img className={styles.logo} src={logo} alt="company" />
        <div>
          <Heading level={1}>{title}</Heading>
          <Text as="p" color="primary">
            {subtitle}
          </Text>
        </div>
      </div>
      <Card className={styles.formCard}>{children}</Card>
    </div>
    <div className={styles.carouselColumn}>
      <Carousel />
    </div>
  </div>
)
