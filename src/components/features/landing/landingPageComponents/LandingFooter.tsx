import cn from 'classnames'
import React from 'react'
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

import { Text } from '@/components/ui/Typography'
import { paths } from '@/paths'

import { LandingButton } from './LandingButton'
import { containerPadding, footerData } from './landingData'
import styles from './styles/LandingFooter.module.scss'

export const LandingFooter = () => {
  const navigate = useNavigate()
  const socialFooterData = [
    { id: 'facebook', icon: FaFacebook, url: paths.facebook },
    { id: 'twitter', icon: FaTwitter, url: paths.twitter },
    { id: 'linkedin', icon: FaLinkedin, url: paths.linkedIn },
    { id: 'instagram', icon: FaInstagram, url: paths.instagram },
    { id: 'youtube', icon: FaYoutube, url: paths.youtube },
  ]

  return (
    <div className={cn(containerPadding, styles.container)}>
      <div className="flex flex-col gap-14">
        <div className="flex flex-col gap-4 md:flex-row justify-between align-center">
          <div className="flex flex-col gap-4">
            <Text size="fs-3xl" weight="bold" color="white">
              Ready to hire smarter?
            </Text>
            <Text size="fs-xl" color="white">
              Start using AuxHR today and discover the future of recruitment.
            </Text>
          </div>
          <div className="flex flex-col gap-3">
            <LandingButton
              title="Get a Demo"
              variant="primary"
              onClick={() => {}}
            />
            <LandingButton
              title="Try it Free"
              variant="secondary"
              onClick={() => {
                navigate(paths.register)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerData.map((item) => (
            <div key={item.key} className="flex flex-col items-start gap-3">
              <Text color="white" size="fs-sm">
                {item.key}
              </Text>
              {item.children.map((child) => {
                const isExternal = child.url.startsWith('http')

                return (
                  <Text
                    size="fs-lg"
                    color="white"
                    key={child.name}
                    onClick={() => {
                      if (isExternal) {
                        window.open(child.url, '_blank')
                      } else {
                        navigate(child.url)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }
                    }}
                    className="cursor-pointer">
                    {child.name}
                  </Text>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 items-center md:flex-row justify-between align-center">
        <Text size="fs-xs" color="white">
          ©{new Date().getFullYear()} AuxHr. All rights reserved
        </Text>
        <div className="flex gap-4">
          {socialFooterData.map(({ id, icon: Icon, url }) => (
            <Icon
              key={id}
              color="white"
              onClick={() => window.open(url, '_blank')}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
