import React from 'react'
import { useNavigate } from 'react-router-dom'

import image from '../../assets/aboutUs.png'
import Jobs from '../../assets/Jobs.png'
import { LandingButton } from './LandingButton'
import { StatCard } from './StatCard'
import styles from './styles/AboutUs.module.scss'
import { BaseText } from './typography'

const stats = [
  {
    value: '60%',
    description: 'Reduction in time to hire',
  },
  {
    value: '70%',
    description: 'Fewer Unqualified Applicants',
  },
  {
    value: '3x',
    description: 'Faster screening and matching',
  },
  {
    value: '50%',
    description: 'Lower Cost per Hire',
  },
  {
    value: '90%',
    description: 'Hiring Team Satisfaction',
  },
]

export const AboutUs = () => {
  const navigate = useNavigate()

  return (
    <div>
      <div className={styles.header}>
        <div className="flex flex-col gap-y-4">
          <BaseText
            fontSize="fs-4xl"
            fontWeight="bold"
            className="font-raleway">
            We are AuxHR Creating exceptional HR software.
          </BaseText>
          <BaseText fontSize="fs-2xl" className="font-raleway">
            Hiring is tough for both SMEs and large enterprises, which is why we
            built a people first HR solution that makes recruitment faster,
            smarter
          </BaseText>
        </div>
        <div className={styles.imgContainer}>
          <div className={styles.box1} />
          <div className={styles.box2} />
          <img src={image} alt="About us" className={styles.img} />
        </div>
      </div>
      <div className={styles.whatwedo}>
        <img src={Jobs} alt="Jobs" className={styles.jobImg} />
        <div className="flex flex-col gap-y-4">
          <BaseText
            fontSize="fs-3xl"
            fontWeight="bold"
            className="font-raleway">
            What We Do
          </BaseText>
          <BaseText
            fontSize="fs-2xl"
            fontWeight="normal"
            className="font-raleway">
            AUXHR is more than just recruitment software it’s a complete
            solution designed to solve common hiring challenges. It simplifies
            the recruitment process from job posting to offer, aligns talent
            through smart matching based on skills, experience, and culture fit,
            and saves time by automating tasks like CV screening and interview
            scheduling. Scalable for both growing SMEs and large enterprises,
            AUXHR provides professional, accessible, and efficient recruitment
            tools that adapt to businesses of any size.
          </BaseText>
        </div>
      </div>
      <div className={styles.whowehelp}>
        <BaseText
          fontSize="fs-3xl"
          fontWeight="bold"
          fontColor="white"
          className="font-raleway text-center">
          Who We Help
        </BaseText>
        <BaseText
          fontSize="fs-2xl"
          fontColor="white"
          className="text-justify font-raleway">
          AUXHR is built to adapt to businesses of any size or stage. For micro
          and small teams, it acts as a ready-made recruitment partner, making
          early hires simple and affordable. For medium-sized companies, it
          streamlines growing complexities and ensures cultural fit. Large
          enterprises benefit from high-volume hiring support and workflow
          management, while startups and SMEs without HR teams can use AUXHR as
          a plug-and-play solution. Even established organisations gain faster,
          more efficient hiring cycles, allowing HR teams to focus on strategy
          over admin.
        </BaseText>
        <div className="flex flex-wrap justify-center gap-6">
          {stats.map((item) => (
            <StatCard
              key={item.value}
              percentage={item.value}
              description={item.description}
            />
          ))}
        </div>
      </div>
      <div className={styles.tryoutauxhr}>
        <BaseText
          fontSize="fs-3xl"
          fontWeight="bold"
          className="text-center font-raleway">
          Try Out AuxHR
        </BaseText>
        <BaseText fontSize="fs-xl" className="font-raleway">
          Explore our full platform with a 15-day free trial. No credit card
          required. Post jobs, hire faster, and manage your people effortlessly
          with our all-in-one platform.
        </BaseText>
        <div className="flex gap-2">
          <LandingButton
            title="Get a Demo"
            variant="tertiary"
            onClick={() => {}}
          />
          <LandingButton
            title="Try it Free"
            variant="primary"
            onClick={() => navigate('/talentRegister')}
          />
        </div>
      </div>
    </div>
  )
}
