import cn from 'classnames'
import React, { useState } from 'react'
import { PiBuildingOfficeBold } from 'react-icons/pi'

import styles from './CompanyTag.module.scss'

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

/** Company logo + name, shown as the employer on a job. */
export const CompanyTag: React.FC<CompanyTagProps> = ({
  organization,
  size = 'sm',
  fallback = 'No company',
  className,
}) => {
  const [logoFailed, setLogoFailed] = useState(false)
  const showLogo = !!organization?.logoUrl && !logoFailed
  const hasName = Boolean(organization?.name)

  return (
    <span className={cn(styles.tag, styles[size], className)}>
      {showLogo ? (
        <img
          src={organization!.logoUrl!}
          alt={`${organization?.name ?? 'Company'} logo`}
          onError={() => setLogoFailed(true)}
          className={styles.logo}
        />
      ) : (
        <span className={styles.icon} aria-hidden>
          <PiBuildingOfficeBold size={size === 'md' ? 16 : 13} />
        </span>
      )}
      <span className={cn(styles.name, !hasName && styles.fallback)}>
        {organization?.name || fallback}
      </span>
    </span>
  )
}
