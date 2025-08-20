import cn from 'classnames'
import React from 'react'
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa'

import { LandingButton } from './LandingButton'
import { containerPadding, footerData } from './landingData'
import styles from './styles/LandingFooter.module.scss'
import { BaseText } from './typography'

export const LandingFooter = () => {
  const socialFooterData = [
    { id: 'facebook', icon: FaFacebook },
    { id: 'twitter', icon: FaTwitter },
    { id: 'linkedin', icon: FaLinkedin },
    { id: 'instagram', icon: FaInstagram },
    { id: 'youtube', icon: FaYoutube },
  ]

  return (
    <div className={cn(containerPadding, styles.container)}>
      <div className="flex flex-col gap-14">
        <div className="flex justify-between align-center">
          <div className="flex flex-col gap-4">
            <BaseText fontSize="fs-3xl" fontWeight="bold" fontColor="white">
              Ready to hire smarter?
            </BaseText>
            <BaseText fontSize="fs-xl" fontColor="white">
              Start using AuxHR today and discover the future of recruitment.
            </BaseText>
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
              onClick={() => {}}
            />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-8">
          {footerData.map((item) => (
            <div key={item.key} className="flex flex-col items-start gap-3">
              <BaseText fontColor="white" fontSize="fs-sm">
                {item.key}
              </BaseText>
              {item.children.map((child) => (
                <BaseText
                  fontSize="fs-lg"
                  fontColor="white"
                  key={child.name}
                  className="cursor-pointer">
                  {child.name}
                </BaseText>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between align-center">
        <BaseText fontSize="fs-xs" fontColor="white">
          ©{new Date().getFullYear()} AuxHr. All rights reserved
        </BaseText>
        <div className="flex gap-4">
          {socialFooterData.map(({ id, icon: Icon }) => (
            <Icon key={id} color="white" />
          ))}
        </div>
      </div>
    </div>
  )
}
