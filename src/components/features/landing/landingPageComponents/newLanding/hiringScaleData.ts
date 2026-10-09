import candidateJuliaKens from './assets/candidate-julia-kens.jpg'
import candidateSkyeFavour from './assets/candidate-skye-favour.jpg'
import candidateTundeFrank from './assets/candidate-tunde-frank.jpg'

export type HiringScaleCandidate = {
  id: string
  name: string
  role: string
  fitLabel: string
  tags: string[]
  photo: string
}

const tags = [
  'Design Systems',
  'Product Design (Expert)',
  'SaaS Ecosystems',
  'Team Mentorship',
]

export const hiringScaleCandidates: HiringScaleCandidate[] = [
  {
    id: 'skye-favour',
    name: 'Skye Favour',
    role: 'Product Sales Specialist',
    fitLabel: '98% fit',
    tags,
    photo: candidateSkyeFavour,
  },
  {
    id: 'tunde-frank',
    name: 'Tunde Frank',
    role: 'Business Manager',
    fitLabel: '98% fit',
    tags,
    photo: candidateTundeFrank,
  },
  {
    id: 'julia-kens',
    name: 'Julia Kens',
    role: 'Full Stack Developer',
    fitLabel: '98% fit',
    tags,
    photo: candidateJuliaKens,
  },
]
