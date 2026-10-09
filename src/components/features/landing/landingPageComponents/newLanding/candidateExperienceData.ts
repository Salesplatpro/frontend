import briefcaseBusiness from './assets/briefcase-business.svg'
import fileQuestion from './assets/file-question.svg'
import journeyCalendar from './assets/journey-calendar.svg'
import journeyCheck from './assets/journey-check.svg'
import journeyMail from './assets/journey-mail.svg'
import journeyOffer from './assets/journey-offer.svg'
import messagesSquare from './assets/messages-square.svg'
import newspaper from './assets/newspaper.svg'

export type JourneyStage = {
  id: string
  label: string
  caption: string
  state: 'done' | 'active' | 'pending'
  icon: string
}

export type CandidateStep = {
  id: string
  title: string
  description: string
  icon: string
}

export const journeyStages: JourneyStage[] = [
  {
    id: 'apply',
    label: 'Apply',
    caption: '1-Click CV Parse',
    state: 'done',
    icon: journeyCheck,
  },
  {
    id: 'assessment',
    label: 'Assessment',
    caption: 'Fair & Adaptive',
    state: 'done',
    icon: journeyCheck,
  },
  {
    id: 'interview',
    label: 'Interview',
    caption: 'Seamless Booking',
    state: 'active',
    icon: journeyCalendar,
  },
  {
    id: 'updates',
    label: 'Updates',
    caption: 'Zero Ghosting',
    state: 'pending',
    icon: journeyMail,
  },
  {
    id: 'offer',
    label: 'Offer',
    caption: 'Digital Signing',
    state: 'pending',
    icon: journeyOffer,
  },
]

export const candidateSteps: CandidateStep[] = [
  {
    id: 'simple-applications',
    title: 'Simple applications',
    description:
      'No tedious 10-page re-typing of resumes. Fast, modern, candidate-friendly submissions.',
    icon: newspaper,
  },
  {
    id: 'clear-communication',
    title: 'Clear communication',
    description:
      'Automated milestone updates prevent candidate drop-off and protect your employer brand.',
    icon: messagesSquare,
  },
  {
    id: 'structured-assessments',
    title: 'Structured assessments',
    description:
      'Consistent questions and evaluation criteria ensure respectful, transparent measurement.',
    icon: fileQuestion,
  },
  {
    id: 'professional-experience',
    title: 'Professional experience',
    description:
      'Elevate candidate sentiment with organized interview briefings and quick scheduling.',
    icon: briefcaseBusiness,
  },
]
