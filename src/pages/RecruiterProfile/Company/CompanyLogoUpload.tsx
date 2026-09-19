import React from 'react'
import { FaCamera, FaTimes } from 'react-icons/fa'

import { useRemoveLogo } from '@/features/organizations/hooks/useRemoveLogo'
import { useUploadLogo } from '@/features/organizations/hooks/useUploadLogo'

import { CompanyLogo } from './CompanyLogo'
import styles from './CompanyLogoUpload.module.scss'

interface CompanyLogoUploadProps {
  organizationId: string
  companyName: string
  logoUrl?: string | null
}

export const CompanyLogoUpload: React.FC<CompanyLogoUploadProps> = ({
  organizationId,
  companyName,
  logoUrl,
}) => {
  const { uploadLogo, isUploading } = useUploadLogo(organizationId)
  const { removeLogo, isRemoving } = useRemoveLogo(organizationId)
  const inputId = `company-logo-${organizationId}`

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    if (file) void uploadLogo(file)
    event.target.value = ''
  }

  return (
    <div className={styles.field} data-field="logo">
      <p className={styles.label}>Company logo</p>
      <div className={styles.logoWrapper}>
        <CompanyLogo name={companyName} logoUrl={logoUrl} size="lg" />
        <label
          htmlFor={inputId}
          className={styles.editButton}
          aria-label="Change company logo">
          <FaCamera size={12} />
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className={styles.fileInput}
          disabled={isUploading}
          onChange={handleChange}
        />
        {logoUrl && (
          <button
            type="button"
            className={styles.removeButton}
            aria-label="Remove company logo"
            disabled={isRemoving}
            onClick={() => void removeLogo()}>
            <FaTimes size={10} />
          </button>
        )}
      </div>
      <p className={styles.hint}>
        JPEG, PNG, or WebP, up to 2MB. Appears next to your company name on
        jobs.
      </p>
    </div>
  )
}
