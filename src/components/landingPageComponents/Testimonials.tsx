import cn from 'classnames'
import React from 'react'
import { FaStar } from 'react-icons/fa'

import testimonialImage from '../../assets/testimonial.png'
import { containerPadding } from './landingData'
import { SectionHeader } from './SectionHeader'
import style from './styles/Testimonal.module.scss'
import { BaseText } from './typography'

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
        <BaseText fontSize="fs-3xl" fontColor="white" fontWeight="bolder">
          AuxHR gave us back weeks of time. We hired three top-tier developers
          in half the usual time
        </BaseText>
        <div>
          <BaseText fontSize="fs-2xl" fontWeight="bold" fontColor="white">
            —Sarah
          </BaseText>
          <BaseText fontSize="fs-md" fontWeight="normal" fontColor="white">
            CTO at SeedTech
          </BaseText>
        </div>
      </div>
      <img src={testimonialImage} alt="Testimonilas" className={style.image} />
    </div>
  </div>
)
