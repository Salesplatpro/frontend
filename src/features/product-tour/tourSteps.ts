export type TourRole = 'recruiter' | 'talent'

export interface TourStep {
  /** Matches a `data-tour` attribute; steps without one show in the middle of the screen. */
  target?: string
  title: string
  body: string
}

export const RECRUITER_TOUR: TourStep[] = [
  {
    title: 'Welcome to Auxhr',
    body: 'Here’s a one-minute look at where things are. You can skip anytime and replay it from the Guide.',
  },
  {
    target: 'company-switcher',
    title: 'Your company',
    body: 'Set up your company first — jobs are posted under it. Switch companies or invite teammates here.',
  },
  {
    target: 'nav-post-job',
    title: 'Post a Job',
    body: 'Create a job with AI or from scratch, choose how applicants are screened, then publish.',
  },
  {
    target: 'nav-my-job-posts',
    title: 'My Job Posts',
    body: 'Every job you posted, with its applicants already scored and ranked so you can start with the strongest.',
  },
  {
    target: 'nav-scout',
    title: 'Scout',
    body: 'Have CVs from elsewhere? Upload them in bulk and AI scores each one against your job.',
  },
  {
    target: 'nav-talent-search',
    title: 'Talent Search',
    body: 'Find talents already on Auxhr by role, experience and location.',
  },
  {
    target: 'nav-chat',
    title: 'Chat and Shortlist',
    body: 'Message talents directly, and keep everyone you shortlisted in one place.',
  },
  {
    target: 'nav-guide',
    title: 'Guide',
    body: 'Short answers on every page and field. You can replay this tour from there.',
  },
  {
    target: 'profile-menu',
    title: 'Your account',
    body: 'Your profile, plan, password and light or dark mode live here. The bell shows notifications.',
  },
]

export const TALENT_TOUR: TourStep[] = [
  {
    title: 'Welcome to Auxhr',
    body: 'Here’s a quick look around so you know where everything is. You can skip anytime.',
  },
  {
    target: 'profile-menu',
    title: 'Finish your profile',
    body: 'Add your roles and upload your CV first. Employers see your profile, and AI uses it to match you to jobs.',
  },
  {
    target: 'nav-pre-assessment',
    title: 'Pre-assessment test',
    body: 'Take this once. Your score is reused for every job you apply to, so give it your best.',
  },
  {
    target: 'nav-jobs',
    title: 'Jobs',
    body: 'Browse open jobs and apply. Each job shows the steps you’ll go through.',
  },
  {
    target: 'nav-pipeline',
    title: 'Applications pipeline',
    body: 'See where each application is, and finish any steps that are waiting for you.',
  },
  {
    target: 'nav-inbox',
    title: 'Inbox',
    body: 'Messages from employers land here.',
  },
  {
    target: 'nav-notifications',
    title: 'Notifications',
    body: 'Updates on your applications, so you never miss a next step.',
  },
]

export const TOUR_STEPS: Record<TourRole, TourStep[]> = {
  recruiter: RECRUITER_TOUR,
  talent: TALENT_TOUR,
}
