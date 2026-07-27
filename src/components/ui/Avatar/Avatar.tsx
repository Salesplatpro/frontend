import React from 'react'

import styles from './Avatar.module.scss'

interface AvatarProps {
  firstName: string
  lastName: string
}

// Reuses the existing brand/accent/warning/success token colors rather than a
// bespoke palette — a simple string hash picks one deterministically so the
// same person always gets the same color.
const PALETTE = [styles.brand, styles.accent, styles.warning, styles.success]

const colorFor = (seed: string) => {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

export const Avatar = ({ firstName, lastName }: AvatarProps) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  return (
    <div
      className={`${styles.avatar} ${colorFor(`${firstName}${lastName}`)}`}
      aria-hidden="true">
      {initials}
    </div>
  )
}
