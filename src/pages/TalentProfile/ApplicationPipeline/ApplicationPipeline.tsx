import React from 'react'

import { PageHero } from '@/components/layout/PageHero'
import { PagePanel } from '@/components/layout/PagePanel'
import { PageShell } from '@/components/layout/PageShell'

import { PipelineTable } from './PipelineTable'

export const ApplicationPipeline = () => {
  return (
    <PageShell wide>
      <PageHero
        compact
        title="Application Pipelines"
        lead="Your job application pipeline. Track your progress and see where you are in the process."
      />
      <PagePanel>
        <PipelineTable />
      </PagePanel>
    </PageShell>
  )
}
