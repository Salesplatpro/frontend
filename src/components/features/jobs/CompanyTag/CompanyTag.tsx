import cn from 'classnames'
import React, { useState } from 'react'
import { PiBuildingOfficeBold } from 'react-icons/pi'

export type JobOrganization = {
  id?: string
  name?: string | null
  logoUrl?: string | null
}

type CompanyTagProps = {
  organization?: JobOrganization | null
  size?: 'sm' | 'md'
  /** Text shown when a job has no company attached (legacy jobs). */
  fallback?: string
  className?: string
}

const SIZES = {
  sm: { box: 'w-6 h-6', icon: 12, text: 'text-sm' },
  md: { box: 'w-9 h-9', icon: 18, text: 'text-base' },
} as const

/** Company logo + name, shown as the employer on a job. */
export const CompanyTag: React.FC<CompanyTagProps> = ({
  organization,
  size = 'sm',
  fallback = 'No company',
  className,
}) => {
  const [logoFailed, setLogoFailed] = useState(false)
  const dimensions = SIZES[size]
  const showLogo = !!organization?.logoUrl && !logoFailed

  return (
    <span className={cn('inline-flex items-center gap-2 min-w-0', className)}>
      {showLogo ? (
        <img
          src={organization!.logoUrl!}
          alt={`${organization?.name ?? 'Company'} logo`}
          onError={() => setLogoFailed(true)}
          className={cn(
            dimensions.box,
            'rounded object-contain bg-grey-100 shrink-0',
          )}
        />
      ) : (
        <span
          className={cn(
            dimensions.box,
            'flex items-center justify-center rounded bg-grey-100 text-grey-600 shrink-0',
          )}>
          <PiBuildingOfficeBold size={dimensions.icon} />
        </span>
      )}
      <span
        className={cn(
          dimensions.text,
          'truncate',
          organization?.name ? 'text-grey-800' : 'text-grey-500 italic',
        )}>
        {organization?.name || fallback}
      </span>
    </span>
  )
}
