import cn from 'classnames'
import React from 'react'
import { FaStar } from 'react-icons/fa'

import testimonialImage from '@/assets/testimonial.png'
import { Text } from '@/components/ui/Typography'

import { containerPadding } from './landingData'
import { SectionHeader } from './SectionHeader'
import style from './styles/Testimonal.module.scss'

export const Testimonials = () => (
  <div className={cn(style.wrapper, containerPadding)}>
    <SectionHeader
      title="Testimonials"
      subTitle="Loved by Hiring Teams Who Move Fast."
      className="items-center justify-center"
    />
    <div className={style.container}>
      <div className={style.testimonial}>
        <div className="flex gap-2">
          {Array.from({ length: 5 }, (_, i) => (
            <FaStar key={i} className={style.star} />
          ))}
        </div>
        <Text size="fs-3xl" color="white" weight="bolder">
          AuxHR gave us back weeks of time. We hired three top-tier developers
          in half the usual time
        </Text>
        <div>
          <Text size="fs-2xl" weight="bold" color="white">
            —Sarah
          </Text>
          <Text size="fs-md" weight="normal" color="white">
            CTO at SeedTech
          </Text>
        </div>
      </div>
      <img src={testimonialImage} alt="Testimonilas" className={style.image} />
    </div>
  </div>
)
