import cn from 'classnames'
import React from 'react'

import image1 from '../../assets/image1.png'
import image2 from '../../assets/image2.png'
import image3 from '../../assets/image3.png'
import { containerPadding } from './landingData'
import { SectionHeader } from './SectionHeader'
import styles from './styles/ItsForYou.module.scss'
import { BaseText } from './typography'

const items = [
  {
    title: 'Startups & Tech Companies',
    desc: 'Find engineers, PMs, and marketers without the long wait.',
    img: image1,
  },
  {
    title: 'Recruitment Agencies',
    desc: 'Scale candidate sourcing with smart automation.',
    img: image2,
  },
  {
    title: 'Growth-Stage Businesses',
    desc: 'Build teams quickly as you expand into new markets.',
    img: image3,
  },
]
export const ItsForYou = () => {
  return (
    <div className={cn(containerPadding, 'flex flex-col gap-11 py-24')}>
      <SectionHeader
        title="It’s for you"
        subTitle="Designed for Modern Hiring Teams."
      />
      <div className="flex justify-between">
        {items.map((item) => (
          <div key={item.title} className={styles.imgContainer}>
            <img src={item.img} alt={item.title} />
            <div>
              <BaseText fontSize="fs-xl">{item.title}</BaseText>
              <BaseText fontSize="fs-sm" fontColor="primary" className="mt-1">
                {item.desc}
              </BaseText>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
