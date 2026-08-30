import React, { useState } from 'react'
import { BsBuilding } from 'react-icons/bs'

import styles from './CompanyLogo.module.scss'

type CompanyLogoProps = {
  name: string
  logoUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  onDark?: boolean
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  name,
  logoUrl,
  size = 'md',
  onDark = false,
}) => {
  const [failed, setFailed] = useState(false)
  const tone = onDark ? styles.onDark : ''

  if (!logoUrl || failed) {
    return (
      <div className={`${styles.fallback} ${styles[size]} ${tone}`} aria-hidden>
        <BsBuilding />
      </div>
    )
  }

  return (
    <img
      src={logoUrl}
      alt={`${name} logo`}
      onError={() => setFailed(true)}
      className={`${styles.image} ${styles[size]} ${tone}`}
    />
  )
}
