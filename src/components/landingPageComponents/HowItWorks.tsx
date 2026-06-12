import cn from 'classnames'
import React, { useState } from 'react'
import { MdArrowOutward } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

import howItWorks from '../../assets/howItWorks.png'
import { paths } from '../../paths'
import { LandingButton } from './LandingButton'
import { containerPadding } from './landingData'
import { SectionHeader } from './SectionHeader'
import styles from './styles/HowItWorks.module.scss'
import { BaseText } from './typography'

const flowTitle = ['Post a role', 'AI Talent Matching', 'Shortlist, Fast']

const flows = [
  {
    text: 'Post a role',
    description:
      'An all-in-one customer service platform that helps you balance everything your customers need to be happy.',
  },
  {
    text: 'AI Talent Matching',
    description:
      'Leverage AI to match candidates with roles based on skills and experience.',
  },
  {
    text: 'Shortlist, Fast',
    description:
      'Quickly shortlist candidates with the best fit for your roles.',
  },
]

export const HowItWorks = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const navigate = useNavigate()

  return (
    <div
      className={cn(
        containerPadding,
        'pt-24 pb-24 flex flex-col gap-16',
        styles.container,
      )}
    >
      <SectionHeader
        title="How it works"
        subTitle="Your Recruitment Workflow, Reinvented."
      />
      <div className="flex flex-col gap-5 md:flex-row justify-between">
        <div className="flex justify-evenly md:justify-normal md:flex-col md:items-start">
          {flowTitle.map((item, index) => (
            <BaseText
              key={item}
              fontColor="primary"
              className={cn(
                index === activeIndex ? styles.active : '',
                styles.flowTitle,
                'cursor-pointer',
              )}
              onClick={() => setActiveIndex(index)}
            >
              {item}
            </BaseText>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <div className="mb-1">
            <BaseText
              fontWeight="bolder"
              fontSize="fs-3xl"
              fontColor="secondary"
            >
              {flows[activeIndex].text}
            </BaseText>
            <BaseText fontColor="primary">
              {flows[activeIndex].description}
            </BaseText>
          </div>
          <div className="w-38">
            <LandingButton
              title="Get Started"
              icon={<MdArrowOutward />}
              variant="secondary"
              // @ts-expect-error TODO: fix type error
              onClick={() => navigate(paths.register)}
            />
          </div>
          <img src={howItWorks} alt="How it works" />
        </div>
      </div>
    </div>
  )
}
