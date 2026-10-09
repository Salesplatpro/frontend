import teamAgencies from './assets/team-agencies.jpg'
import teamGrowth from './assets/team-growth.jpg'
import teamStartups from './assets/team-startups.jpg'

export type HiringTeam = {
  id: string
  title: string
  description: string
  image: string
}

export const hiringTeams: HiringTeam[] = [
  {
    id: 'startups',
    title: 'Startups & Tech Companies',
    description: 'Find engineers, PMs, and marketers without the long wait.',
    image: teamStartups,
  },
  {
    id: 'agencies',
    title: 'Recruitment Agencies',
    description: 'Scale candidate sourcing with smart automation.',
    image: teamAgencies,
  },
  {
    id: 'growth-stage',
    title: 'Growth-Stage Businesses',
    description: 'Build teams quickly as you expand into new markets.',
    image: teamGrowth,
  },
]
