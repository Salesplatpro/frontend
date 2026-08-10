import React from 'react'

import styles from './Avatar.module.scss'

export type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  firstName?: string | null
  lastName?: string | null
  size?: AvatarSize
  className?: string
}

// Reuses the existing brand/accent/warning/success token colors rather than a
// bespoke palette — a simple string hash picks one deterministically so the
// same person always gets the same color.
const PALETTE = [styles.brand, styles.accent, styles.warning, styles.success]

const SIZE_CLASS: Record<AvatarSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
}

const colorFor = (seed: string) => {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

export const Avatar = ({
  firstName = '',
  lastName = '',
  size = 'md',
  className,
}: AvatarProps) => {
  const first = (firstName || '').trim()
  const last = (lastName || '').trim()
  const initials = `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || '?'
  const seed = `${first}${last}` || 'user'

  return (
    <div
      className={[styles.avatar, SIZE_CLASS[size], colorFor(seed), className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true">
      {initials}
    </div>
  )
}
