import type { StepDef } from '@/components/ui/Stepper/Stepper'

export type ScoutStepId = 'campaign' | 'upload' | 'results'

export const SCOUT_STEPS: StepDef<ScoutStepId>[] = [
  { id: 'campaign', title: 'Campaign', description: 'Describe the role' },
  { id: 'upload', title: 'Upload CVs', description: 'Add up to 50' },
  { id: 'results', title: 'Results', description: 'Review the shortlist' },
]
