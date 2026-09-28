import React from 'react'

import { Select } from '@/components/forms/Select'
import { useGetAiConfigsQuery } from '@/redux/api/recruiter'

import { AiConfigApiRecord } from './aiConfigPayload'

type SavedConfig = AiConfigApiRecord & { id: string; createdAt?: string }

type CopySetupSelectProps = {
  excludeId?: string
  onCopy: (config: SavedConfig) => void
}

export const CopySetupSelect = ({
  excludeId,
  onCopy,
}: CopySetupSelectProps) => {
  const { data, isLoading } = useGetAiConfigsQuery(undefined)
  const configs: SavedConfig[] = (
    Array.isArray(data?.data?.aiConfigs) ? data.data.aiConfigs : []
  ).filter((config: SavedConfig) => config.id !== excludeId)

  if (!isLoading && configs.length === 0) return null

  const options = configs.map((config) => ({
    value: config.id,
    label: [
      config.name || 'Untitled setup',
      config.createdAt ? new Date(config.createdAt).toLocaleDateString() : null,
    ]
      .filter(Boolean)
      .join(' · '),
  }))

  return (
    <Select
      name="copySetup"
      label="Copy a setup from another job"
      placeholder="Choose a saved setup"
      options={options}
      value={null}
      isLoading={isLoading}
      searchable
      onChange={(id) => {
        const config = configs.find((item) => item.id === id)
        if (config) onCopy(config)
      }}
    />
  )
}
