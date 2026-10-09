import badgeCheckTab from './assets/badge-check.svg'
import badgeCheckEyebrow from './assets/badge-check-eyebrow.svg'
import botEyebrow from './assets/bot-eyebrow.svg'
import botTab from './assets/bot-tab.svg'
import candidatePhoto from './assets/candidate-photo.jpg'
import circleUserTab from './assets/circle-user.svg'
import circleUserEyebrow from './assets/circle-user-eyebrow.svg'
import layoutDashboardTab from './assets/layout-dashboard.svg'
import layoutDashboardEyebrow from './assets/layout-dashboard-eyebrow.svg'

export type HeroTabId = 'briefcase' | 'person' | 'grid' | 'shield'

type DiagnosticCard = {
  kind: 'diagnostic'
  title: string
  name: string
  roleLine: string
  matchLabel: string
  tagsLabel: string
  tags: string[]
  synthesisLabel: string
  synthesis: string
}

type StepperCard = {
  kind: 'stepper'
  steps: {
    label: string
    status: 'completed' | 'pending'
    pillLabel: string
  }[]
}

type DashboardCard = {
  kind: 'dashboard'
  metricLabel: string
  metricValue: string
  table: {
    initials: string
    name: string
    preScreening: string
    cvMatch: string
  }[]
}

type PhotoCard = {
  kind: 'photo'
  photoSrc: string
  name: string
  roleLine: string
  matchLabel: string
  tags: string[]
}

export type HeroTabContent = {
  id: HeroTabId
  tabIcon: string
  eyebrowIcon: string
  eyebrow: string
  heading: string
  body: string
  ctaLabel: string
  card: DiagnosticCard | StepperCard | DashboardCard | PhotoCard
}

// Tab 1 ("briefcase") copy/layout is pulled exact from Figma.
// Tabs 2-4 copy/headings match the reference screenshot; their card mocks are
// reconstructed using the same confirmed fonts/colors/spacing, not Figma-sourced.
export const heroTabs: HeroTabContent[] = [
  {
    id: 'briefcase',
    tabIcon: botTab,
    eyebrowIcon: botEyebrow,
    eyebrow: 'Intelligent Hiring',
    heading: 'Seamless Automated hiring',
    body: "Recruitment shouldn't require hours of repetitive work. AuxHR uses AI to help your team quickly understand candidate profiles, match cvs,  identify relevant matches, and surface useful insights throughout the hiring process.",
    ctaLabel: 'Learn more',
    card: {
      kind: 'diagnostic',
      title: 'CANDIDATE DIAGNOSTIC BRIEF',
      name: 'Sarah Johnson',
      roleLine: 'Target: Senior Product Designer',
      matchLabel: '94% Match Fit',
      tagsLabel: 'STRONG MATCHES',
      tags: [
        'Design Systems',
        'Product Design (Expert)',
        'SaaS Ecosystems',
        'Team Mentorship',
      ],
      synthesisLabel: 'AUXHR SYNTHESIS',
      synthesis:
        'Strong candidate for interview. Portfolio demonstrates exceptional systems thinking, high cross-functional collaboration, and verified technical execution.',
    },
  },
  {
    id: 'person',
    tabIcon: circleUserTab,
    eyebrowIcon: circleUserEyebrow,
    eyebrow: 'Faster screening',
    heading: 'Right fit, Less time',
    body: "Recruitment shouldn't require hours of repetitive work. AuxHR uses AI to help your team quickly understand candidate profiles, match cvs,  identify relevant matches, and surface useful insights throughout the hiring process.",
    ctaLabel: 'Learn more',
    card: {
      kind: 'stepper',
      steps: [
        {
          label: 'Pre-Assessment',
          status: 'completed',
          pillLabel: 'Completed',
        },
        { label: 'CV-Matching', status: 'completed', pillLabel: 'Completed' },
        {
          label: 'Personality Test',
          status: 'pending',
          pillLabel: 'Take Test',
        },
        {
          label: 'Personalized Test',
          status: 'pending',
          pillLabel: 'Take Test',
        },
      ],
    },
  },
  {
    id: 'grid',
    tabIcon: layoutDashboardTab,
    eyebrowIcon: layoutDashboardEyebrow,
    eyebrow: 'Dashboard and Insights',
    heading: 'Clear candidate insights',
    body: 'Understand strengths, technical competencies, and role alignment immediately through plain-language diagnostic summaries.',
    ctaLabel: 'Learn more',
    card: {
      kind: 'dashboard',
      metricLabel: 'Applications',
      metricValue: '1,100',
      table: [
        {
          initials: 'AB',
          name: 'Adebanji Bolaji',
          preScreening: '67%',
          cvMatch: '80%',
        },
        {
          initials: 'OI',
          name: 'Oladejo Israel',
          preScreening: '72%',
          cvMatch: '80%',
        },
        {
          initials: 'EC',
          name: 'Eze Chinedu',
          preScreening: '85%',
          cvMatch: '80%',
        },
        {
          initials: 'DT',
          name: 'Desmond Tutu',
          preScreening: '37%',
          cvMatch: '80%',
        },
      ],
    },
  },
  {
    id: 'shield',
    tabIcon: badgeCheckTab,
    eyebrowIcon: badgeCheckEyebrow,
    eyebrow: 'Pinpoint accuracy',
    heading: 'Match with confidence',
    body: 'Understand the exact reasoning behind every single score. Explainable AI outlines key strengths and potential growth zones in transparent language.',
    ctaLabel: 'Learn more',
    card: {
      kind: 'photo',
      photoSrc: candidatePhoto,
      name: 'Sarah Johnson',
      roleLine: 'Senior Product Designer',
      matchLabel: '98% fit',
      tags: [
        'Design Systems',
        'Product Design (Expert)',
        'SaaS Ecosystems',
        'Team Mentorship',
      ],
    },
  },
]
