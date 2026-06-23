import React from 'react'

import AiConfig from '../PostJobs/AiConfig/AiConfig'

type EditAiConfigProps = {
  aiConfigId: string
  jobId?: string
}

export const EditAiConfig = ({ aiConfigId }: EditAiConfigProps) => (
  <AiConfig mode="edit" aiConfigId={aiConfigId} />
)
