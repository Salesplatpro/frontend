import pretestIcon from '../../../../assets/pretestIcon.webp'
import cvmatchIcon from '../../../../assets/cvmatchIcon.webp'
import personalizedIcon from '../../../../assets/personalizedIcon.webp'
import { Progress, Application } from '../../utils/type'

const getProgresses = (application: Application): Progress[] => {
  const stagesMapping = {
    prescreening: { icon: pretestIcon, title: 'Pre-Assessment' },
    cv_similarity: { icon: cvmatchIcon, title: 'CV-Matching' },
    personalized: { icon: personalizedIcon, title: 'Personalized Test' },
    personality: { icon: personalizedIcon, title: 'Personality Test' },
  }

  const progresses: Progress[] = []
  const stages = Object.keys(
    application.stages,
  ) as (keyof typeof stagesMapping)[]
  let currentStage = application.currentStage
  let currentStageFound = false

  stages.forEach((stage) => {
    if (stagesMapping[stage]) {
      let status
      if (stage === currentStage) {
        status = 'current'
        currentStageFound = true
      } else if (!currentStageFound) {
        status = 'completed'
      } else {
        status = 'awaiting'
      }
      progresses.push({
        icon: stagesMapping[stage].icon,
        title: stagesMapping[stage].title,
        status: status,
      })
    }
  })

  return progresses
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return '#34C759'
    case 'current':
      return '#3C6FD4'
    case 'awaiting':
      return '#FF3B30'
    default:
      return '#E7EDF7'
  }
}

export default getProgresses
