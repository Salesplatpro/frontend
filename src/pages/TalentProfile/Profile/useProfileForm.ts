import { FormikHelpers } from 'formik'
import { useState } from 'react'

import { useProfile } from '@/features/profile/hooks/useProfile'
import { buildProfileFormValues } from '@/features/profile/hooks/useProfileFormValues'
import { useUpdateProfile } from '@/features/profile/hooks/useUpdateProfile'
import { useUploadCv } from '@/features/profile/hooks/useUploadCv'
import { ProfileFormValues } from '@/features/profile/types'
import { diffProfileValues } from '@/features/profile/utils/diffProfileValues'
import { calculateProgress } from '@/utils/calculateProgress'

export const useProfileForm = () => {
  const { profile, isLoading, error } = useProfile()
  const { updateProfile, isUpdating } = useUpdateProfile()
  const { uploadCv, isUploading, progress } = useUploadCv()

  const [cvFileName, setCvFileName] = useState<string | null>(null)
  const [formProgress, setFormProgress] = useState(0)

  const initialValues = buildProfileFormValues(profile)

  const updateFormProgress = (values: ProfileFormValues) => {
    setFormProgress(
      calculateProgress(
        values,
        !!(profile?.cvFileName || profile?.cvUploadedAt),
      ),
    )
  }

  const handleSubmit = async (
    values: ProfileFormValues,
    { setSubmitting, resetForm }: FormikHelpers<ProfileFormValues>,
  ) => {
    const patch = diffProfileValues(initialValues, values)

    if (Object.keys(patch).length > 0) {
      const success = await updateProfile(patch)
      if (success) {
        resetForm({ values })
      }
    }

    setSubmitting(false)
  }

  const handleCvChange = (file: File) => {
    setCvFileName(file.name)
    void uploadCv(file)
  }

  return {
    profile,
    isLoading,
    error,
    isUpdating,
    isUploading,
    progress,
    cvFileName,
    formProgress,
    initialValues,
    updateFormProgress,
    handleSubmit,
    handleCvChange,
  }
}
